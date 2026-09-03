/**
 * One-off Webflow HTML → MDX migrator.
 *
 * Usage:
 *   node scripts/migrate-legacy-page.mjs <collection> <slug>
 *   node scripts/migrate-legacy-page.mjs <legacy-html-path>
 *
 * Examples:
 *   node scripts/migrate-legacy-page.mjs articles is-it-worth-hiring-a-microsoft-fabric-consultancy-in-2026
 *   node scripts/migrate-legacy-page.mjs data-stories redesigning-linkedin-analytics
 *   node scripts/migrate-legacy-page.mjs legacy/portfolio/a-nobel-prize-data-story/index.html
 *
 * Writes src/content/<collection>/<slug>/{en,ro}.mdx and copies local images
 * into src/content/<collection>/<slug>/images/.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
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
const CHROME_CLASS_RE =
  /case-study-secondary-navigation|cookie-solution|webflow-badge|warning-mobile-wrapper|white-background-wrapper|gv-richt-text|footer-nav|full-screen footer|\bfooter section\b/;
const CHROME_TAGS = new Set(["script", "style", "link", "noscript"]);

function fail(message) {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv) {
  if (argv.length < 1) {
    fail(
      "Usage: node scripts/migrate-legacy-page.mjs <collection> <slug>\n" +
        "   or: node scripts/migrate-legacy-page.mjs <legacy-html-path>",
    );
  }

  const first = argv[0].replaceAll("\\", "/");
  if (first.endsWith(".html") || first.startsWith("legacy/")) {
    const htmlPath = path.resolve(ROOT, argv[0]);
    const rel = path.relative(path.join(ROOT, "legacy"), htmlPath).replaceAll("\\", "/");
    const parts = rel.split("/");
    if (parts.length < 2) fail(`Cannot infer collection/slug from ${argv[0]}`);
    return {
      collection: parts[0],
      slug: parts[1],
      htmlPath,
    };
  }

  if (argv.length < 2) fail("Usage: node scripts/migrate-legacy-page.mjs <collection> <slug>");
  const collection = argv[0];
  const slug = argv[1];
  return {
    collection,
    slug,
    htmlPath: path.join(ROOT, "legacy", collection, slug, "index.html"),
  };
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

function nextElement(html, from) {
  let i = from;
  while (i < html.length) {
    const lt = html.indexOf("<", i);
    if (lt === -1) return null;
    if (html.startsWith("<!--", lt)) {
      const end = html.indexOf("-->", lt + 4);
      i = end === -1 ? html.length : end + 3;
      continue;
    }
    if (html.startsWith("</", lt)) return null;
    const open = html.slice(lt).match(/^<([a-zA-Z][a-zA-Z0-9]*)/);
    if (!open) {
      i = lt + 1;
      continue;
    }
    const tagEnd = html.indexOf(">", lt);
    if (tagEnd === -1) return null;
    const name = open[1];
    const attrs = html.slice(lt, tagEnd + 1);
    const selfClosing = VOID_TAGS.has(name.toLowerCase()) || html[tagEnd - 1] === "/";
    if (selfClosing) {
      return { tag: name, index: lt, html: html.slice(lt, tagEnd + 1), attrs };
    }
    const close = findMatchingClose(html, name, tagEnd + 1);
    const end = close === -1 ? html.length : close + `</${name}>`.length;
    return { tag: name, index: lt, html: html.slice(lt, end), attrs };
  }
  return null;
}

function decodeEntities(value) {
  return value
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", '"')
    .replaceAll("&#x27;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">");
}

function extractMeta(html) {
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1] || "";
  const description =
    (html.match(/<meta\s+content="([^"]*)"\s+name="description"/i) ||
      html.match(/<meta\s+name="description"\s+content="([^"]*)"/i) ||
      [])[1] || "";
  return {
    title: decodeEntities(title).trim(),
    description: decodeEntities(description).trim(),
  };
}

function extractPubDate(html) {
  const datetime = html.match(/<time[^>]*datetime="([^"]+)"/i);
  if (datetime) {
    const parsed = new Date(datetime[1]);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);
  }
  const published = html.match(/Last Published:\s*([A-Za-z]{3}\s+[A-Za-z]{3}\s+\d{1,2}\s+\d{4})/);
  if (published) {
    const parsed = new Date(published[1]);
    if (!Number.isNaN(parsed.valueOf())) return parsed.toISOString().slice(0, 10);
  }
  return "2026-01-01";
}

function isChrome(el) {
  if (CHROME_TAGS.has(el.tag.toLowerCase())) return true;
  return CHROME_CLASS_RE.test(el.attrs);
}

function extractContentHtml(html) {
  const nav = findOpenByClass(html, "case-study-nav");
  if (!nav) fail("Could not find .case-study-nav in legacy HTML");
  const navClose = findMatchingClose(html, nav.tag, nav.end);
  if (navClose === -1) fail("Could not close .case-study-nav");

  const chunks = [];
  let pos = navClose + `</${nav.tag}>`.length;
  while (pos < html.length) {
    const el = nextElement(html, pos);
    if (!el) break;
    pos = el.index + el.html.length;
    if (isChrome(el)) continue;
    if (el.tag.toLowerCase() === "div" && /section styleguide/.test(el.html.slice(0, 200))) {
      const wrapper = el.html.match(/<div class="wrapper">([\s\S]*)<\/div>\s*<\/div>\s*<\/div>\s*$/);
      chunks.push(wrapper ? wrapper[1] : el.html);
      continue;
    }
    chunks.push(el.html);
  }

  if (!chunks.length) fail("No content siblings found after .case-study-nav");
  return chunks.join("\n");
}

function stripScriptsAndBadges(html) {
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, "")
    .replace(/<style\b[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<div[^>]*webflow-badge[\s\S]*?<\/div>/gi, "")
    .replace(/<a[^>]*webflow\.com[\s\S]*?<\/a>/gi, "");
}

function demoteHeadings(html) {
  return html.replace(/<(\/?)h1(\b[^>]*)?>/gi, "<$1h2$2>");
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
    .replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi, (_, attrs, inner) => {
      const sources = inner.match(/<source\b[^>]*\/?>/gi) || [];
      return `<video${attrs}>${sources.join("")}</video>`;
    })
    .replace(/>\s+</g, "><")
    .replace(/\s+\n/g, "\n")
    .trim();
}

function wrapForMdx(html) {
  return `<div class="legacy-html" set:html={${JSON.stringify(html)}} />`;
}

function yamlQuote(value) {
  return `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", " ")}"`;
}

function existingFrontmatter(filePath) {
  if (!fs.existsSync(filePath)) return null;
  const text = fs.readFileSync(filePath, "utf8");
  const match = text.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const block = match[1];
  const pubDate = (block.match(/^pubDate:\s*(.+)$/m) || [])[1];
  const tagsMatch = block.match(/^tags:\n((?:  - .+\n)*)/m);
  const tags = tagsMatch
    ? tagsMatch[1]
        .split("\n")
        .map((line) => line.replace(/^\s*-\s*/, "").trim())
        .filter(Boolean)
    : [];
  return { pubDate, tags };
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
  return /\.(png|jpe?g|gif|svg|webp|avif|mp4|webm|pdf)$/i.test(url.split("?")[0]);
}

function uniqueName(name, used) {
  if (!used.has(name)) {
    used.add(name);
    return name;
  }
  const ext = path.extname(name);
  const stem = name.slice(0, -ext.length);
  let i = 2;
  let next = `${stem}-${i}${ext}`;
  while (used.has(next)) {
    i += 1;
    next = `${stem}-${i}${ext}`;
  }
  used.add(next);
  return next;
}

function copyAndRewrite(html, htmlPath, imagesDir) {
  const urls = collectLocalUrls(html).filter(isLocalAsset);
  const used = new Set();
  const rewrites = new Map();
  const concerns = [];

  fs.mkdirSync(imagesDir, { recursive: true });

  for (const url of urls) {
    if (rewrites.has(url)) continue;
    const name = uniqueName(imageFileName(url), used);
    const from = path.resolve(path.dirname(htmlPath), decodeURIComponent(url.split("?")[0].split("#")[0]));
    const to = path.join(imagesDir, name);
    try {
      fs.copyFileSync(from, to);
    } catch (error) {
      concerns.push(`Could not copy ${url} → ${name}: ${error.message}`);
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

function buildMdx({ title, description, pubDate, translationStatus, tags, body }) {
  const lines = [
    "---",
    `title: ${yamlQuote(title)}`,
    `description: ${yamlQuote(description || title)}`,
    `pubDate: ${pubDate}`,
    `translationStatus: ${translationStatus}`,
  ];
  if (tags?.length) {
    lines.push("tags:");
    for (const tag of tags) lines.push(`  - ${tag}`);
  }
  lines.push("---", "", body.trim(), "");
  return lines.join("\n");
}

function migrate() {
  const { collection, slug, htmlPath } = parseArgs(process.argv.slice(2));
  if (!fs.existsSync(htmlPath)) fail(`Legacy HTML not found: ${htmlPath}`);

  const raw = fs.readFileSync(htmlPath, "utf8");
  const { title, description } = extractMeta(raw);
  const outDir = path.join(ROOT, "src", "content", collection, slug);
  const imagesDir = path.join(outDir, "images");
  const enPath = path.join(outDir, "en.mdx");
  const existing = existingFrontmatter(enPath);
  const pubDate = existing?.pubDate || extractPubDate(raw);

  let body = extractContentHtml(raw);
  body = stripScriptsAndBadges(body);
  body = demoteHeadings(body);
  body = selfCloseVoids(body);
  body = minifyHtml(body);
  const rewritten = copyAndRewrite(body, htmlPath, imagesDir);
  body = wrapForMdx(rewritten.html);

  fs.mkdirSync(outDir, { recursive: true });
  fs.writeFileSync(
    enPath,
    buildMdx({
      title,
      description,
      pubDate,
      translationStatus: "translated",
      tags: existing?.tags,
      body,
    }),
    "utf8",
  );
  fs.writeFileSync(
    path.join(outDir, "ro.mdx"),
    buildMdx({
      title,
      description,
      pubDate,
      translationStatus: "untranslated",
      tags: existing?.tags,
      body,
    }),
    "utf8",
  );

  console.log(`Migrated ${collection}/${slug}`);
  console.log(`  title: ${title}`);
  console.log(`  images: ${rewritten.copied}`);
  for (const concern of rewritten.concerns) console.warn(`  WARN: ${concern}`);
  if (rewritten.concerns.length) process.exitCode = 2;
}

migrate();
