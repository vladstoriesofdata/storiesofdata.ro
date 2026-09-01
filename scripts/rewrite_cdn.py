#!/usr/bin/env python3
from __future__ import annotations

import re
import urllib.parse
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ASSETS = ROOT / "assets" / "cdn.prod.website-files.com" / "6405ef20051268cd8ed6af48"
CDN_RE = re.compile(
    r"https://cdn\.prod\.website-files\.com/6405ef20051268cd8ed6af48/"
    r"(?:[^\"'>\\\s]|%(?:[0-9A-Fa-f]{2})|\s(?=[A-Za-z0-9._-]))+"
)

by_name = {path.name: path for path in ASSETS.rglob("*") if path.is_file()}


def rel(from_file: Path, target: Path) -> str:
    start = from_file.parent.resolve().parts
    dest = target.resolve().parts
    i = 0
    while i < min(len(start), len(dest)) and start[i].lower() == dest[i].lower():
        i += 1
    ups = [".."] * (len(start) - i)
    downs = [urllib.parse.quote(part, safe="()[]@,!&") for part in dest[i:]]
    return "/".join(ups + downs)


def main() -> None:
    changed = 0
    remaining: set[str] = set()
    files = list(ROOT.rglob("*.html")) + list(ROOT.rglob("*.css"))
    for path in files:
        if ".git" in path.parts:
            continue
        text = path.read_text(encoding="utf-8", errors="latin-1")
        original = text

        def repl(match: re.Match[str]) -> str:
            url = match.group(0).rstrip(".,;")
            name = urllib.parse.unquote(url.rsplit("/", 1)[-1].split(",")[0])
            target = by_name.get(name)
            if target is None:
                remaining.add(url)
                return match.group(0)
            return rel(path, target)

        text = CDN_RE.sub(repl, text)
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")
            changed += 1
            print(f"updated {path.relative_to(ROOT)}")

    print(f"files changed {changed}")
    print(f"still remote {len(remaining)}")
    for url in sorted(remaining)[:30]:
        print(" ", url[:200])

    index = (ROOT / "index.html").read_text(encoding="utf-8", errors="latin-1")
    for match in re.finditer(r'href="([^"]+)"[^>]*>([^<]*(?:Terms|Privacy|privacy)[^<]*)', index, re.I):
        print("LINK", match.group(2).strip(), "->", match.group(1))


if __name__ == "__main__":
    main()
