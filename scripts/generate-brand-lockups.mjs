#!/usr/bin/env node

/**
 * Generate the ZarishNoksha logo lockups (mark + wordmark) as blind SVGs and
 * retina PNGs, for the press/download tiles on /design-system.
 *
 * The wordmark ("ZarishNoksha") is vectorized once at build time from the
 * vendored Alumni Sans SemiBold typeface, so the downloaded SVGs render
 * identically on any machine with nothing to load.
 *
 * Output (into site/public/assets/brand/):
 *   zarishnoksha-logo-on-dark.svg / .png  (kinpaku gold on transparent)
 *   zarishnoksha-logo-on-light.svg / .png (ink on transparent)
 *
 * Usage: bun run scripts/generate-brand-lockups.mjs
 */

import * as fontkit from "fontkit";
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { MARK_PATHS } from "./brand-mark.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");
const FONT_PATH = path.join(__dirname, "vendor", "alumni-sans-semibold.woff");
const OUT_DIR = path.join(ROOT_DIR, "site", "public", "assets", "brand");

const WORDMARK = "ZarishNoksha";
const TRACKING = 8; // extra units between glyphs, on a 1000-unit em
const MARK_SCALE = 4.5;
const MARK_X = 28;
const MARK_Y = 51;
const TEXT_X = 160;
const TEXT_BASELINE = 128.5;
const TEXT_SCALE = 0.0795;
const VIEWBOX_W = 560;
const VIEWBOX_H = 210;

function glyphPathString(font, char, xOffset) {
  const glyph = font.glyphForCodePoint(char.codePointAt(0));
  // Paths are emitted in raw font units (1000-unit em). The enclosing <g>
  // already applies the TEXT_SCALE transform, so the coordinates here must
  // NOT be scaled again or the wordmark collapses to a sliver (double scale).
  const scale = 1;
  const parts = [];
  for (const c of glyph.path.commands) {
    if (c.command === "moveTo" || c.command === "lineTo") {
      const [x, y] = c.args;
      parts.push(`${c.command === "moveTo" ? "M" : "L"}${fmt(xOffset + x * scale)} ${fmt(-y * scale)}`);
    } else if (c.command === "bezierCurveTo") {
      const [x1, y1, x2, y2, x, y] = c.args;
      parts.push(
        `C${fmt(xOffset + x1 * scale)} ${fmt(-y1 * scale)} ${fmt(xOffset + x2 * scale)} ${fmt(-y2 * scale)} ${fmt(xOffset + x * scale)} ${fmt(-y * scale)}`,
      );
    } else if (c.command === "quadraticCurveTo") {
      const [x1, y1, x, y] = c.args;
      parts.push(`Q${fmt(xOffset + x1 * scale)} ${fmt(-y1 * scale)} ${fmt(xOffset + x * scale)} ${fmt(-y * scale)}`);
    } else if (c.command === "closePath") {
      parts.push("z");
    }
  }
  return parts.join("");
}

function fmt(n) {
  return Number(n.toFixed(2)).toString();
}

function buildWordmarkPaths(font) {
  let pen = 0;
  const parts = [];
  for (const char of WORDMARK) {
    const glyph = font.glyphForCodePoint(char.codePointAt(0));
    const d = glyphPathString(font, char, pen);
    if (d) parts.push(`<path d="${d}"/>`);
    pen += glyph.advanceWidth + TRACKING;
  }
  return parts.join("");
}

function buildLockup(font, color) {
  const mark = MARK_PATHS.map((d) => `<path d="${d}"/>`).join("");
  const wordmark = buildWordmarkPaths(font);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX_W} ${VIEWBOX_H}" width="${VIEWBOX_W}" height="${VIEWBOX_H}" fill="none">
  <g transform="translate(${MARK_X} ${MARK_Y}) scale(${MARK_SCALE})" fill="${color}">${mark}</g>
  <g transform="translate(${TEXT_X} ${TEXT_BASELINE}) scale(${TEXT_SCALE} -${TEXT_SCALE})" fill="${color}">${wordmark}</g>
</svg>
`;
}

async function renderPng(svg, outPath, scale = 4) {
  const buf = Buffer.from(svg);
  const image = sharp(buf);
  const meta = await image.metadata();
  const { data, info } = await image
    .resize(meta.width * scale, meta.height * scale)
    .png()
    .toBuffer({ resolveWithObject: true });
  fs.writeFileSync(outPath, data);

  // Fail loudly if the render came back blank (font or path regression).
  let opaque = 0;
  for (let i = 3; i < data.length; i += 4) if (data[i] > 0) opaque += 1;
  if (opaque === 0) {
    console.error(`  ! blank render for ${path.basename(outPath)}`);
    process.exitCode = 1;
  }
  const size = (data.length / 1024).toFixed(0);
  console.log(`  ${path.relative(ROOT_DIR, outPath)} (${size} KB, ${info.width}x${info.height})`);
}

const fontObj = fontkit.openSync(FONT_PATH);
if (!fontObj) {
  console.error("Failed to open vendored font", FONT_PATH);
  process.exit(1);
}

const variants = [
  { name: "zarishnoksha-logo-on-dark", color: "#ffba00" },
  { name: "zarishnoksha-logo-on-light", color: "#1a1a1a" },
];

for (const { name, color } of variants) {
  const svg = buildLockup(fontObj, color);
  const svgPath = path.join(OUT_DIR, `${name}.svg`);
  fs.writeFileSync(svgPath, svg);
  console.log(`Wrote ${path.relative(ROOT_DIR, svgPath)}`);
  await renderPng(svg, path.join(OUT_DIR, `${name}.png`));
}

console.log("Lockups generated.");
