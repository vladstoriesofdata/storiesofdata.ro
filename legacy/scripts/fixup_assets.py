#!/usr/bin/env python3
"""Download leftover assets and repair rewritten HTML/CSS."""

from __future__ import annotations

import re
import ssl
import urllib.parse
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "cdn.prod.website-files.com" / "6405ef20051268cd8ed6af48"
UA = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)
ssl_ctx = ssl.create_default_context()

MISSING = [
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/64493f12af69b05eec7812aa_Chord.gif",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6601527fd8406ff501839e93_BTR%26Storiesofdata%20(1).png",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a7e558a208e895b96ff9_SOD_BTR%20Business%20Study_resize-poster-00001.jpg",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a7e558a208e895b96ff9_SOD_BTR%20Business%20Study_resize-transcode.mp4",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a7e558a208e895b96ff9_SOD_BTR%20Business%20Study_resize-transcode.webm",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a6ad05a7260457fc29bc_SOD_Power%20Bi%20Chainformation_resize-poster-00001.jpg",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a6ad05a7260457fc29bc_SOD_Power%20Bi%20Chainformation_resize-transcode.mp4",
    "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/6613a6ad05a7260457fc29bc_SOD_Power%20Bi%20Chainformation_resize-transcode.webm",
    "https://www.storiesofdata.com/401",
    "https://www.storiesofdata.com/404",
    "https://www.storiesofdata.com/terms",
    "https://www.storiesofdata.com/terms-of-service",
    "https://www.storiesofdata.com/legal/terms-and-conditions",
]


def fetch(url: str) -> bytes:
    req = urllib.request.Request(
        url,
        headers={"User-Agent": UA, "Referer": "https://www.storiesofdata.com/", "Accept": "*/*"},
    )
    with urllib.request.urlopen(req, context=ssl_ctx, timeout=60) as resp:
        return resp.read()


def local_for_cdn(url: str) -> Path:
    parsed = urllib.parse.urlparse(url)
    name = Path(urllib.parse.unquote(parsed.path)).name
    return ASSETS / name


def page_path(url: str) -> Path:
    parsed = urllib.parse.urlparse(url)
    rel = parsed.path.strip("/")
    return ROOT / rel / "index.html"


def download_missing() -> dict[str, Path]:
    mapping: dict[str, Path] = {}
    for url in MISSING:
        try:
            data = fetch(url)
        except Exception as exc:  # noqa: BLE001
            print(f"SKIP {url} :: {exc}")
            continue
        if "storiesofdata.com/" in url and "cdn.prod" not in url:
            path = page_path(url)
        else:
            path = local_for_cdn(url)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        mapping[url] = path
        mapping[urllib.parse.unquote(url)] = path
        print(f"OK {path.relative_to(ROOT)} ({len(data)} bytes)")
    return mapping


def rewrite_remaining(mapping: dict[str, Path]) -> None:
    text_files = list(ROOT.rglob("*.html")) + list(ROOT.rglob("*.css"))
    cdn_re = re.compile(
        r"https://cdn\.prod\.website-files\.com/6405ef20051268cd8ed6af48/[^\"')\s]+"
    )
    for path in text_files:
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="latin-1")
        original = text

        def repl(match: re.Match[str]) -> str:
            remote = match.group(0)
            decoded = urllib.parse.unquote(remote)
            target = mapping.get(remote) or mapping.get(decoded)
            if target is None:
                filename = Path(urllib.parse.unquote(urllib.parse.urlparse(remote).path)).name
                candidate = ASSETS / filename
                if candidate.exists():
                    target = candidate
                else:
                    return remote
            rel = Path(os_rel(path.parent, target))
            return rel.as_posix()

        text = cdn_re.sub(repl, text)
        # also unquoted spaces in remaining CDN urls
        text = re.sub(r' integrity="[^"]+"', "", text)
        if path.suffix == ".html":
            text = text.replace(' crossorigin="anonymous"', "")
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            print(f"updated {path.relative_to(ROOT)}")


def os_rel(start: Path, target: Path) -> str:
    start_parts = start.resolve().parts
    target_parts = target.resolve().parts
    i = 0
    while i < min(len(start_parts), len(target_parts)) and start_parts[i].lower() == target_parts[i].lower():
        i += 1
    ups = [".."] * (len(start_parts) - i)
    downs = list(target_parts[i:])
    return "/".join(ups + [urllib.parse.quote(p, safe="()[]@,!&") for p in downs])


if __name__ == "__main__":
    mapping = download_missing()
    # include already downloaded CDN files
    for file in ASSETS.rglob("*"):
        if file.is_file():
            url = "https://cdn.prod.website-files.com/6405ef20051268cd8ed6af48/" + urllib.parse.quote(file.name)
            mapping[url] = file
            mapping[urllib.parse.unquote(url)] = file
    rewrite_remaining(mapping)
    print("done")
