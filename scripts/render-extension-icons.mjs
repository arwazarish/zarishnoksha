#!/usr/bin/env node

/**
 * Rasterizes the extension + site icon set from the canonical ZN mark.
 *
 * - extension/icons/icon-{16,32,48,128}.png from extension/icons/icon.svg
 * - extension/icons/promo-small.png is handled by generate-promo-tile.js
 * - site/public/apple-touch-icon.png as a full-bleed tile (no rounded corners,
 *   iOS applies its own mask) so it never shows transparent corners.
 *
 * Run: node scripts/render-extension-icons.mjs
 */

import fs from "fs";
import path from "path";
import sharp from "sharp";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const ICONS_DIR = path.join(ROOT, "extension/icons");
const ICON_SVG = path.join(ICONS_DIR, "icon.svg");
const APPLE_OUT = path.join(ROOT, "site/public/apple-touch-icon.png");

const MARK_PATHS = {
  z: "M2 2.5h8.5v3H2zM10.5 6.8v3l-8 10.7v-3zM2 18.5h8.5v3H2z",
  n: "M13.5 2.5h3v19h-3zM19 2.5h3v19h-3zM16 2.5l3.5 17l-2.25.47l-3.5-17z",
};

const appletouch = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <rect width="180" height="180" fill="#1a1a1a"/>
  <g transform="translate(42,42) scale(4)" fill="#ffba00">
    <path d="${MARK_PATHS.z}"/>
    <path d="${MARK_PATHS.n}"/>
  </g>
</svg>
`;

const sizes = [
  [16, path.join(ICONS_DIR, "icon-16.png")],
  [32, path.join(ICONS_DIR, "icon-32.png")],
  [48, path.join(ICONS_DIR, "icon-48.png")],
  [128, path.join(ICONS_DIR, "icon-128.png")],
];

// Blank-pixel sanity check: asserts the mark actually rendered ink.
async function assertNotBlank(buffer) {
  const stats = await sharp(buffer).stats();
  const channel = stats.channels.find((c) => c.mean > 0);
  if (!channel) throw new Error("rendered image is completely blank");
}

const svgBuffer = fs.readFileSync(ICON_SVG);
for (const [size, out] of sizes) {
  const buf = await sharp(svgBuffer).resize(size, size).png().toBuffer();
  await assertNotBlank(buf);
  fs.writeFileSync(out, buf);
  console.log(`${path.relative(ROOT, out)} (${size}x${size})`);
}

const appleBuf = await sharp(Buffer.from(appletouch)).png().toBuffer();
await assertNotBlank(appleBuf);
fs.writeFileSync(APPLE_OUT, appleBuf);
console.log(`${path.relative(ROOT, APPLE_OUT)} (180x180)`);
