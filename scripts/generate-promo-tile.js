#!/usr/bin/env node

/**
 * Generates the Chrome Web Store small promo tile (440x280) from an SVG template.
 *
 * Run: node scripts/generate-promo-tile.js
 */

import fs from "fs";
import path from "path";
import { chromium } from "playwright";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "extension/icons/promo-small.png");

// Brand colors
const BG = "#0e0d10";
const BG_TOP = "#161318";
const MAGENTA = "#cc1b89"; // approximates oklch(55% 0.25 350)
const TEXT = "#f5f3ef";
const TEXT_DIM = "#7a7680";

const svg = `
<svg width="440" height="280" viewBox="0 0 440 280" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="${BG_TOP}"/>
      <stop offset="1" stop-color="${BG}"/>
    </linearGradient>
    <linearGradient id="slop" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#a855f7"/>
      <stop offset="0.5" stop-color="#ec4899"/>
      <stop offset="1" stop-color="#06b6d4"/>
    </linearGradient>
    <radialGradient id="cardGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0" stop-color="#3a1a4a" stop-opacity="0.6"/>
      <stop offset="1" stop-color="#1a0f24" stop-opacity="0.3"/>
    </radialGradient>
    <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="6"/>
      <feOffset dx="0" dy="3" result="offsetblur"/>
      <feComponentTransfer><feFuncA type="linear" slope="0.4"/></feComponentTransfer>
      <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="440" height="280" fill="url(#bg)"/>

  <!-- Subtle grid texture -->
  <g opacity="0.04" stroke="${TEXT}" stroke-width="0.5">
    <line x1="0" y1="70" x2="440" y2="70"/>
    <line x1="0" y1="140" x2="440" y2="140"/>
    <line x1="0" y1="210" x2="440" y2="210"/>
    <line x1="110" y1="0" x2="110" y2="280"/>
    <line x1="220" y1="0" x2="220" y2="280"/>
    <line x1="330" y1="0" x2="330" y2="280"/>
  </g>

  <!-- Brand wordmark (top-left) -->
  <g transform="translate(28, 26)">
    <rect width="24" height="24" rx="4.5" fill="#1a1a1a"/>
    <g transform="translate(4.5,4.5) scale(0.625)" fill="${TEXT}">
      <path d="M2 2.5h8.5v3H2zM10.5 6.8v3l-8 10.7v-3zM2 18.5h8.5v3H2z"/>
      <path d="M13.5 2.5h3v19h-3zM19 2.5h3v19h-3zM16 2.5l3.5 17l-2.25.47l-3.5-17z"/>
    </g>
    <text x="34" y="17" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" font-size="16" font-weight="600" fill="${TEXT}" letter-spacing="-0.01em">ZarishNoksha</text>
  </g>

  <!-- Small badge top-right -->
  <g transform="translate(338, 28)">
    <rect width="74" height="20" rx="10" fill="${TEXT}" fill-opacity="0.06"/>
    <text x="37" y="14" text-anchor="middle" font-family="-apple-system, system-ui, sans-serif" font-size="10" font-weight="500" fill="${TEXT_DIM}" letter-spacing="0.04em">DEVTOOLS</text>
  </g>

  <!-- Demo card group (centered, slightly offset) -->
  <g transform="translate(64, 92)">
    <!-- Faux UI card -->
    <g filter="url(#softShadow)">
      <rect x="0" y="0" width="312" height="92" rx="14" fill="#1a1422"/>
      <rect x="0" y="0" width="312" height="92" rx="14" fill="url(#cardGlow)"/>
    </g>

    <!-- Sparkles inside the card (more AI slop vibes) -->
    <text x="32" y="56" font-family="-apple-system, system-ui, sans-serif" font-size="20" fill="#fbbf24">✨</text>
    <text x="268" y="56" font-family="-apple-system, system-ui, sans-serif" font-size="20" fill="#fbbf24">✨</text>

    <!-- Gradient text headline (the slop being detected) -->
    <text x="156" y="52" text-anchor="middle"
          font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
          font-size="20" font-weight="700"
          fill="url(#slop)">AI-Powered Magic</text>

    <!-- Subline -->
    <text x="156" y="72" text-anchor="middle"
          font-family="-apple-system, system-ui, sans-serif"
          font-size="10" fill="#9b94a8" letter-spacing="0.02em">Reimagining the future of everything</text>

    <!-- zarishnoksha magenta outline (offset by 2px outside the card)
         Path so top-left corner is square (where label meets it) -->
    <path d="M -4 -4 L 312 -4 Q 316 -4 316 0 L 316 92 Q 316 96 312 96 L 0 96 Q -4 96 -4 92 L -4 -4 Z"
          fill="none" stroke="${MAGENTA}" stroke-width="2" stroke-linejoin="round"/>

    <!-- Label tab on top, flush with outline's outer edge.
         Label extends to x=-5 (matching outline visible left edge) and y=-3 (covering the outline's top stroke). -->
    <path d="M -5 -3 L -5 -22 Q -5 -26 -1 -26 L 113 -26 Q 117 -26 117 -22 L 117 -3 Z"
          fill="${MAGENTA}"/>
    <text x="2" y="-10"
          font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
          font-size="11" font-weight="600" fill="white" letter-spacing="0.01em">
      ✦ gradient text
    </text>
  </g>

  <!-- Tagline at bottom -->
  <text x="28" y="244"
        font-family="-apple-system, BlinkMacSystemFont, system-ui, sans-serif"
        font-size="15" font-weight="600" fill="${TEXT}" letter-spacing="-0.01em">
    Detect AI slop in any web page.
  </text>
  <text x="28" y="262"
        font-family="-apple-system, system-ui, sans-serif"
        font-size="11" fill="${TEXT_DIM}" letter-spacing="0.01em">
    44 detections · Open DevTools and see what needs fixing.
  </text>
</svg>
`;

const browser = await chromium.launch();
const page = await browser.newPage();
await page.setViewportSize({ width: 440, height: 280 });
await page.setContent(`
  <!DOCTYPE html>
  <html>
  <head><style>
    * { margin: 0; padding: 0; }
    body { width: 440px; height: 280px; overflow: hidden; }
  </style></head>
  <body>${svg}</body>
  </html>
`);
await page.screenshot({ path: OUT, omitBackground: false });
await browser.close();

console.log(`Generated ${path.relative(ROOT, OUT)}`);
