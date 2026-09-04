/**
 * Restore .cs-planetary / .cs-mountaintop / .cs-grassroot wrappers from
 * legacy HTML into portfolio and data-story MDX (en + ro).
 *
 * Usage: node scripts/restore-zoom-wrappers.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const COLLECTIONS = ["portfolio", "data-stories"];
const WRAPPERS = [
  "cs-planetary-wrapper",
  "cs-mountaintop-wrapper",
  "cs-grassroot-wrapper",
];
const VOID_TAGS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function findOpenByClass(html, className) {
  const re = new RegExp(
    `<([a-zA-Z][a-zA-Z0-9]*)([^>]*\\bclass="[^"]*\\b${className}\\b[^"]*"[^>]*)>`,
    "i",
  );
  const match = html.match(re);
  if (!match) return null;
  return { tag: match[1], index: match.index, end: match.index + match[0].length };
}

function findMatchingClose(html, tag, start) {
  let i = start;
  let depth = 1;
  const lower = tag.toLowerCase();
  while (i < html.length && depth > 0) {
    const nextLt = html.indexOf("<", i);
    if (nextLt === -1) return -1;
    if (html.startsWith("<!--", nextLt)) {
      const end = html.indexOf("-->", nextLt + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html.startsWith("</", nextLt)) {
      const close = html.slice(nextLt).match(/^<\/([a-zA-Z][a-zA-Z0-9]*)>/);
      if (!close) {
        i = nextLt + 2;
        continue;
      }
      if (close[1].toLowerCase() === lower) {
        depth -= 1;
        if (depth === 0) return nextLt;
      }
      i = nextLt + close[0].length;
      continue;
    }
    const open = html.slice(nextLt).match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    if (!open) {
      i = nextLt + 1;
      continue;
    }
    const tagEnd = html.indexOf(">", nextLt);
    if (tagEnd === -1) return -1;
    const name = open[1];
    const selfClosing = VOID_TAGS.has(name.toLowerCase()) || html[tagEnd - 1] === "/";
    if (!selfClosing && name.toLowerCase() === lower) depth += 1;
    i = tagEnd + 1;
  }
  return -1;
}

function extractByClass(html, className) {
  const open = findOpenByClass(html, className);
  if (!open) return null;
  const close = findMatchingClose(html, open.tag, open.end);
  if (close === -1) return html.slice(open.index);
  return html.slice(open.index, close + `</${open.tag}>`.length);
}

function stripNestedChrome(html) {
  let next = html;
  for (const className of ["views-nav", "case-study-nav", "case-study-secondary-navigation"]) {
    const open = findOpenByClass(next, className);
    if (!open) continue;
    const close = findMatchingClose(next, open.tag, open.end);
    if (close === -1) continue;
    next = next.slice(0, open.index) + next.slice(close + `</${open.tag}>`.length);
  }
  return next;
}

function emptyWrapper(className) {
  return `<div class="${className}"></div>`;
}

function selfCloseVoids(html) {
  return html.replace(/<([a-zA-Z][a-zA-Z0-9]*)([^>]*?)>/g, (full, tag, attrs) => {
    if (!VOID_TAGS.has(tag.toLowerCase())) return full;
    if (full.endsWith("/>")) return full;
    return `<${tag}${attrs}/>`;
  });
}

function minifyHtml(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi, (_, attrs, inner) => {
      const sources = inner.match(/<source\b[^>]*\/?>/gi) || [];
      return `<video${attrs}>${sources.join("")}</video>`;
    })
    .replace(/<iframe\b([^>]*)>/gi, (full, attrs) => {
      if (/\bsandbox=/i.test(attrs)) return full;
      return `<iframe sandbox="allow-scripts"${attrs}>`;
    })
    .replace(/>\s+</g, "><")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function demoteHeadings(html) {
  return html.replace(/<(\/?)h1(\b[^>]*)?>/gi, "<$1h2$2>");
}

function wrapForMdx(html) {
  return `<div class="legacy-html" set:html={${JSON.stringify(html)}} />`;
}

function imageFileName(src) {
  const base = decodeURIComponent(path.basename(src.split("?")[0].split("#")[0]));
  const hashed = base.match(/^[0-9a-f]{24}_(.+)$/i);
  const raw = hashed ? hashed[1] : base.includes("_") ? base.slice(base.indexOf("_") + 1) : base;
  return raw.replace(/[<>:"/\\|?*]/g, "-").replace(/\s+/g, "-");
}

function collectLocalUrls(html) {
  const found = new Set();
  for (const match of html.matchAll(/\b(?:src|href|poster|data-poster-url|data-src)="([^"]+)"/gi)) {
    found.add(match[1]);
  }
  for (const match of html.matchAll(/\bsrcset="([^"]+)"/gi)) {
    for (const part of match[1].split(",")) {
      const url = part.trim().split(/\s+/)[0];
      if (url) found.add(url);
    }
  }
  for (const match of html.matchAll(/\bdata-video-urls="([^"]+)"/gi)) {
    for (const url of match[1].split(",")) {
      if (url.trim()) found.add(url.trim());
    }
  }
  for (const match of html.matchAll(/url\((?:&quot;|&apos;|'|")?([^)'"]+)(?:&quot;|&apos;|'|")?\)/gi)) {
    found.add(decodeEntities(match[1]));
  }
  return [...found];
}

function isLocalAsset(url) {
  if (!url) return false;
  if (/^(https?:|data:|mailto:|tel:|#|\/\/)/i.test(url)) return false;
  return /\.(png|jpe?g|gif|svg|webp|avif|mp4|webm|pdf|json)$/i.test(url.split("?")[0]);
}

function normalizeKey(name) {
  return name.replace(/\.[^.]+$/, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}

function matchExisting(imagesDir, preferredName) {
  if (!fs.existsSync(imagesDir)) return null;
  const files = fs.readdirSync(imagesDir);
  if (files.includes(preferredName)) return preferredName;
  const preferredKey = normalizeKey(preferredName);
  const ext = path.extname(preferredName).toLowerCase();
  return (
    files.find(
      (file) => normalizeKey(file) === preferredKey && path.extname(file).toLowerCase() === ext,
    ) || null
  );
}

function copyAndRewrite(html, htmlPath, imagesDir) {
  const urls = collectLocalUrls(html).filter(isLocalAsset);
  const rewrites = new Map();
  const concerns = [];

  fs.mkdirSync(imagesDir, { recursive: true });

  for (const url of urls) {
    if (rewrites.has(url)) continue;
    const preferred = imageFileName(url);
    const existing = matchExisting(imagesDir, preferred);
    const name = existing || preferred;
    const from = path.resolve(path.dirname(htmlPath), decodeURIComponent(url.split("?")[0].split("#")[0]));
    const to = path.join(imagesDir, name);
    if (!existing) {
      try {
        fs.copyFileSync(from, to);
      } catch (error) {
        concerns.push(`Could not copy ${url} → ${name}: ${error.message}`);
      }
    }
    rewrites.set(url, `./images/${name}`);
  }

  let next = html;
  const sorted = [...rewrites.entries()].sort((a, b) => b[0].length - a[0].length);
  for (const [from, to] of sorted) {
    next = next.split(from).join(to);
  }
  return { html: next, concerns, copied: rewrites.size };
}

function replaceMdxBody(filePath, body) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`MDX not found: ${filePath}`);
  }
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(/^(---\n[\s\S]*?\n---\n)/);
  if (!match) {
    throw new Error(`No frontmatter in ${filePath}`);
  }
  fs.writeFileSync(filePath, `${match[1]}\n${body.trim()}\n`, "utf8");
}

function restoreSlug(collection, slug) {
  const htmlPath = path.join(ROOT, "legacy", collection, slug, "index.html");
  const outDir = path.join(ROOT, "src", "content", collection, slug);
  const imagesDir = path.join(outDir, "images");
  const raw = fs.readFileSync(htmlPath, "utf8");

  const pieces = WRAPPERS.map((className) => {
    const extracted = extractByClass(raw, className);
    if (!extracted) return emptyWrapper(className);
    return stripNestedChrome(extracted);
  });

  let html = pieces.join("");
  html = minifyHtml(html);
  html = demoteHeadings(html);
  html = selfCloseVoids(html);
  const rewritten = copyAndRewrite(html, htmlPath, imagesDir);
  const body = wrapForMdx(rewritten.html);

  replaceMdxBody(path.join(outDir, "en.mdx"), body);
  replaceMdxBody(path.join(outDir, "ro.mdx"), body);

  return {
    slug: `${collection}/${slug}`,
    wrappers: WRAPPERS.map((className, index) => ({
      className,
      empty: pieces[index] === emptyWrapper(className),
      length: pieces[index].length,
    })),
    images: rewritten.copied,
    concerns: rewritten.concerns,
  };
}

function main() {
  const results = [];
  for (const collection of COLLECTIONS) {
    const legacyRoot = path.join(ROOT, "legacy", collection);
    for (const entry of fs.readdirSync(legacyRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const htmlPath = path.join(legacyRoot, entry.name, "index.html");
      if (!fs.existsSync(htmlPath)) continue;
      results.push(restoreSlug(collection, entry.name));
    }
  }

  for (const result of results) {
    const flags = result.wrappers
      .map((wrapper) => `${wrapper.className.split("-")[1]}${wrapper.empty ? "(empty)" : ""}`)
      .join(", ");
    console.log(`${result.slug}: ${flags}; images ${result.images}`);
    for (const concern of result.concerns) console.warn(`  WARN: ${concern}`);
  }
}

main();
