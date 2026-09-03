import fs from "node:fs";
import path from "node:path";
import type { AstroIntegration } from "astro";

const COLLECTIONS = ["articles", "portfolio", "data-stories"] as const;

export function copyContentImages(root = process.cwd()): void {
  for (const collection of COLLECTIONS) {
    const srcRoot = path.join(root, "src", "content", collection);
    if (!fs.existsSync(srcRoot)) continue;

    for (const entry of fs.readdirSync(srcRoot, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;

      const srcImages = path.join(srcRoot, entry.name, "images");
      if (!fs.existsSync(srcImages) || !fs.statSync(srcImages).isDirectory()) {
        continue;
      }

      const destImages = path.join(
        root,
        "public",
        collection,
        entry.name,
        "images",
      );
      fs.cpSync(srcImages, destImages, { recursive: true });
    }
  }
}

export default function copyContentImagesIntegration(): AstroIntegration {
  const copy = () => copyContentImages();

  return {
    name: "copy-content-images",
    hooks: {
      "astro:server:setup": copy,
      "astro:build:start": copy,
    },
  };
}
