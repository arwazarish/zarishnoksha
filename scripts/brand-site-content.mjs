#!/usr/bin/env node

/**
 * Display-brand pass for the markdown docs under site/content: upgrades prose
 * "zarishnoksha" to "ZarishNoksha" while never touching command refs, code
 * spans, dot-paths, env vars, or "npx zarishnoksha" invocations.
 *
 * Dry run: node scripts/brand-site-content.mjs --dry
 * Apply:   node scripts/brand-site-content.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const CONTENT = path.join(ROOT, "site/content");
const DRY = process.argv.includes("--dry");

function walk(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .flatMap((e) => (e.isDirectory() ? walk(path.join(dir, e.name)) : [path.join(dir, e.name)]));
}

const files = walk(CONTENT).filter((f) => f.endsWith(".md"));
const RE = /(?<![/.`\-\w])(?<!npx )zarishnoksha(?![\w-])/g;

let total = 0;
for (const f of files) {
  const lines = fs.readFileSync(f, "utf8").split("\n");
  let changed = false;
  const out = lines.map((line) => {
    if (!RE.test(line)) return line;
    changed = true;
    const next = line.replace(RE, "ZarishNoksha");
    total++;
    console.log(`${path.relative(ROOT, f)}\n  - ${line}\n  + ${next}`);
    return next;
  });
  if (changed && !DRY) fs.writeFileSync(f, out.join("\n"));
}
console.log(`\n${total} line(s) changed (${DRY ? "dry run" : "applied"}).`);
