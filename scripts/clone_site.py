#!/usr/bin/env python3
"""Clone https://www.storiesofdata.com into a local static HTML site."""

from __future__ import annotations

import hashlib
import re
import ssl
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor, as_completed
from pathlib import Path
from threading import Lock

ROOT = Path(__file__).resolve().parents[1]
ORIGIN = "https://www.storiesofdata.com"
USER_AGENT = (
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
    "(KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36"
)

SEED_PAGES = [
    f"{ORIGIN}/",
    f"{ORIGIN}/privacy-policy",
    f"{ORIGIN}/terms-and-conditions",
    f"{ORIGIN}/portfolio/advanced-matrix-visual-built-with-deneb-in-power-bi",
    f"{ORIGIN}/portfolio/a-nobel-prize-data-story",
    f"{ORIGIN}/portfolio/multi-line-chart-with-custom-tooltips-power-bi-custom-visual",
    f"{ORIGIN}/portfolio/category-comparison-bar-chart-power-bi-custom-visual",
    f"{ORIGIN}/portfolio/a-romanian-data-story",
    f"{ORIGIN}/portfolio/btr-business-case-study",
    f"{ORIGIN}/portfolio/chainformation-business-case-study",
    f"{ORIGIN}/portfolio/building-a-better-matrix-visual-with-deneb-in-power-bi",
]

DOWNLOAD_HOSTS = {
    "www.storiesofdata.com",
    "storiesofdata.com",
    "cdn.prod.website-files.com",
    "assets.website-files.com",
    "uploads-ssl.webflow.com",
    "d3e54v103j8qbb.cloudfront.net",
    "fonts.googleapis.com",
    "fonts.gstatic.com",
    "ajax.googleapis.com",
    "cdnjs.cloudflare.com",
    "cdn.jsdelivr.net",
}

PARSE_SUFFIXES = {".html", ".css", ".json", ".svg", ".txt", ".xml"}
TEXT_SUFFIXES = PARSE_SUFFIXES | {".js", ".map"}

URL_RE = re.compile(r"""https?://[^\s"'<>\\)]+|//(?:cdn\.prod\.website-files\.com|fonts\.(?:googleapis|gstatic)\.com|d3e54v103j8qbb\.cloudfront\.net|ajax\.googleapis\.com|cdnjs\.cloudflare\.com|cdn\.jsdelivr\.net)/[^\s"'<>\\)]+""", re.IGNORECASE)
CSS_URL_RE = re.compile(r"""url\(\s*(['"]?)([^'")]+)\1\s*\)""", re.IGNORECASE)
ATTR_RE = re.compile(
    r"""(?:src|href|srcset|data-src|content|poster)\s*=\s*(['"])(.*?)\1""",
    re.IGNORECASE,
)

ssl_ctx = ssl.create_default_context()
lock = Lock()
downloaded: dict[str, Path] = {}
queued: set[str] = set()
pending: list[str] = []
failures: list[str] = []


def log(msg: str) -> None:
    print(msg, flush=True)


def normalize_url(url: str, base: str | None = None) -> str | None:
    if not url:
        return None
    url = url.strip().strip("\\").rstrip(".,);]}")
    if not url or url.startswith(("data:", "mailto:", "tel:", "javascript:", "#", "blob:")):
        return None
    if url.startswith("//"):
        url = "https:" + url
    if base:
        url = urllib.parse.urljoin(base, url)
    parsed = urllib.parse.urlparse(url)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname:
        return None
    path = parsed.path or "/"
    while "//" in path:
        path = path.replace("//", "/")
    return urllib.parse.urlunparse((parsed.scheme, parsed.netloc, path, "", parsed.query, ""))


def should_download(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    host = (parsed.hostname or "").lower()
    if host not in DOWNLOAD_HOSTS:
        return False
    if host in {"cdnjs.cloudflare.com", "cdn.jsdelivr.net", "ajax.googleapis.com"}:
        path = parsed.path.lower()
        return any(token in path for token in ("bodymovin", "scrollify", "webfont", "finsweet", "jquery"))
    if host in {"www.storiesofdata.com", "storiesofdata.com"}:
        if parsed.path.startswith("/cdn-cgi/"):
            return False
    return True


def is_site_page(url: str) -> bool:
    parsed = urllib.parse.urlparse(url)
    host = (parsed.hostname or "").lower()
    if host not in {"www.storiesofdata.com", "storiesofdata.com"}:
        return False
    suffix = Path(parsed.path).suffix.lower()
    return suffix not in {
        ".css", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp",
        ".json", ".woff", ".woff2", ".ttf", ".map", ".ico", ".avif",
    }


def local_path_for(url: str) -> Path:
    parsed = urllib.parse.urlparse(url)
    host = (parsed.hostname or "misc").lower()
    path = urllib.parse.unquote(parsed.path or "/")

    if host in {"www.storiesofdata.com", "storiesofdata.com"}:
        rel = path.lstrip("/")
        if not rel or rel.endswith("/"):
            return ROOT / rel / "index.html"
        suffix = Path(rel).suffix.lower()
        if suffix:
            return ROOT / rel
        return ROOT / rel / "index.html"

    rel = path.lstrip("/")
    if parsed.query:
        digest = hashlib.md5(parsed.query.encode("utf-8")).hexdigest()[:8]
        p = Path(rel)
        rel = str(p.with_name(f"{p.stem}-{digest}{p.suffix}"))
    return ROOT / "assets" / host / rel


def posix_relpath(start: Path, target: Path) -> str:
    start_parts = start.resolve().parts
    target_parts = target.resolve().parts
    i = 0
    while i < min(len(start_parts), len(target_parts)) and start_parts[i].lower() == target_parts[i].lower():
        i += 1
    ups = [".."] * (len(start_parts) - i)
    downs = list(target_parts[i:])
    if not ups and not downs:
        return "."
    return "/".join(ups + downs)


def relative_href(from_file: Path, to_file: Path) -> str:
    rel_path = posix_relpath(from_file.parent, to_file)
    parts = []
    for part in rel_path.replace("\\", "/").split("/"):
        if part in {".", "..", ""}:
            parts.append(part)
        else:
            parts.append(urllib.parse.quote(part, safe="()[]@,!"))
    href = "/".join(parts)
    if not href.startswith("."):
        href = "./" + href
    return href


def enqueue(url: str, base: str | None = None) -> None:
    normalized = normalize_url(url, base)
    if not normalized or not should_download(normalized):
        return
    with lock:
        if normalized in queued:
            return
        queued.add(normalized)
        pending.append(normalized)


def fetch(url: str) -> tuple[bytes, str]:
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Language": "en-US,en;q=0.9",
            "Referer": ORIGIN + "/",
        },
    )
    last_error: Exception | None = None
    for attempt in range(2):
        try:
            with urllib.request.urlopen(req, context=ssl_ctx, timeout=25) as resp:
                return resp.read(), resp.headers.get("Content-Type", "")
        except urllib.error.HTTPError as exc:
            last_error = exc
            if exc.code in {404, 410, 403}:
                raise
            time.sleep(0.8 * (attempt + 1))
        except Exception as exc:  # noqa: BLE001
            last_error = exc
            time.sleep(0.8 * (attempt + 1))
    raise last_error  # type: ignore[misc]


def looks_text(path: Path, content_type: str, data: bytes) -> bool:
    if path.suffix.lower() in TEXT_SUFFIXES:
        return True
    lowered = content_type.lower()
    if any(token in lowered for token in ("text/", "json", "javascript", "xml", "svg")):
        return True
    head = data[:180].lstrip()
    return head.startswith((b"<!DOCTYPE", b"<html", b"{", b"/*", b"@font-face"))


def should_parse(path: Path) -> bool:
    return path.suffix.lower() in PARSE_SUFFIXES or path.name == "index.html"


def extract_urls(text: str) -> list[str]:
    found: list[str] = []
    for match in URL_RE.finditer(text):
        found.append(match.group(0))
    for match in CSS_URL_RE.finditer(text):
        found.append(match.group(2))
    for match in ATTR_RE.finditer(text):
        value = match.group(2)
        if "," in value and ("w," in value or "x," in value or "w" in value.split(" ")[-1:]):
            for part in value.split(","):
                token = part.strip().split(" ")[0]
                if token:
                    found.append(token)
        else:
            found.append(value)
    return found


def decode_text(data: bytes) -> str:
    try:
        return data.decode("utf-8")
    except UnicodeDecodeError:
        return data.decode("latin-1")


def process_url(url: str) -> tuple[str, Path | None, str, list[str]]:
    path = local_path_for(url)
    if path.exists() and path.stat().st_size > 0:
        data = path.read_bytes()
        content_type = ""
    else:
        data, content_type = fetch(url)
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)

    extra: list[str] = []
    if looks_text(path, content_type, data) and should_parse(path):
        extra = extract_urls(decode_text(data))
    elif path.suffix.lower() == ".js" and "website-files.com" in url:
        extra = extract_urls(decode_text(data))
    return url, path, content_type, extra


def rewrite_files() -> None:
    log("Rewriting local URLs...")
    mapping: list[tuple[str, Path]] = sorted(downloaded.items(), key=lambda item: len(item[0]), reverse=True)
    for url, path in list(downloaded.items()):
        if not looks_text(path, "", path.read_bytes()[:300] if path.exists() else b""):
            continue
        original = decode_text(path.read_bytes())
        text = original
        for remote, local in mapping:
            href = relative_href(path, local)
            text = text.replace(remote, href)
            if remote.startswith("https://"):
                text = text.replace("http://" + remote[len("https://"):], href)
                text = text.replace(remote.replace("https://", "//"), href)
        if text != original:
            path.write_text(text, encoding="utf-8", newline="\n")


def crawl() -> None:
    for seed in SEED_PAGES:
        enqueue(seed)

    round_no = 0
    while True:
        with lock:
            batch = pending[:]
            pending.clear()
        if not batch:
            break
        round_no += 1
        log(f"Round {round_no}: {len(batch)} URLs")
        with ThreadPoolExecutor(max_workers=8) as pool:
            futures = [pool.submit(process_url, url) for url in batch]
            for future in as_completed(futures):
                url = ""
                try:
                    url, path, _content_type, extra = future.result()
                    with lock:
                        downloaded[url] = path  # type: ignore[assignment]
                    log(f"  OK {url}")
                    for found in extra:
                        enqueue(found, url)
                        normalized = normalize_url(found, url)
                        if normalized and is_site_page(normalized):
                            enqueue(normalized, url)
                except Exception as exc:  # noqa: BLE001
                    failures.append(f"{url or 'unknown'} :: {exc}")
                    log(f"  FAIL {url or exc}")

    rewrite_files()
    log(f"\nDownloaded {len(downloaded)} files")
    if failures:
        log(f"Failures ({len(failures)}):")
        for item in failures:
            log("  " + item)


if __name__ == "__main__":
    sys.stdout.reconfigure(encoding="utf-8")
    crawl()
