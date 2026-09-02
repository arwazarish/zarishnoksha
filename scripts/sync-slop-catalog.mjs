#!/usr/bin/env node

/**
 * Syncs site/pages/slop/index.astro's rule catalog to the canonical 44-rule
 * registry (cli/engine/registry/antipatterns.mjs):
 *  - drops 5 retired cards (glassmorphism, hero-metric-layout,
 *    identical-card-grids, over-round, sketchy-svg)
 *  - adds 3 design-system cards (font, color, radius)
 *  - fixes the sidebar / lede / description counts
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const FILE = path.resolve(__dirname, "../site/pages/slop/index.astro");
let src = fs.readFileSync(FILE, "utf8");

const STALE = ["glassmorphism", "hero-metric-layout", "identical-card-grids", "over-round", "sketchy-svg"];
let removed = 0;
for (const id of STALE) {
  const re = new RegExp(`<article class="rule-card" id="rule-${id}"[\\s\\S]*?<\\/article>\\n?`);
  const before = src.length;
  src = src.replace(re, "");
  if (src.length !== before) removed++;
}
if (removed !== 5) {
  console.error(`expected to remove 5 stale cards, removed ${removed}`);
  process.exit(1);
}

const CARD = (id, visual, name, desc) => `<article class="rule-card" id="rule-${id}" data-layer="cli">
      <div class="rule-card-visual" aria-hidden="true"><div class="rule-card-visual-inner">${visual}</div></div>
      <div class="rule-card-body">
        <div class="rule-card-head">
          <span class="rule-card-category" data-category="quality">Quality</span>
          <span class="rule-card-layer" data-layer="cli" title="Deterministic. Runs from \`npx zarishnoksha detect\` on files, no browser required.">CLI</span>
        </div>
        <h3 class="rule-card-name">${name}</h3>
        <p class="rule-card-desc">${desc}</p>
      </div>
    </article>

`;

const CARDS = {
  "section-typography": CARD(
    "design-system-font",
    `<div style="font-family: system-ui, sans-serif; color: #111; background: #fff; padding: 12px 16px;"><div style="font-size: 11px; color: #999; margin-bottom: 6px;">DESIGN.md typography: Inter</div><div style="font-size: 16px; font-weight: 600;">Helvetica Now strolls in</div></div>`,
    "Font outside DESIGN.md",
    "A font is used that is not declared in DESIGN.md typography. Use the documented type system or update DESIGN.md if this is an intentional brand addition.",
  ),
  "section-color-contrast": CARD(
    "design-system-color",
    `<div style="background: #fff; padding: 12px; font-family: system-ui, sans-serif;"><div style="font-size: 11px; color: #999; margin-bottom: 8px;">DESIGN.md palette loaded</div><div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px;"><div style="height: 32px; border-radius: 6px; background: oklch(22% .04 78);"></div><div style="height: 32px; border-radius: 6px; background: oklch(48% .08 78);"></div><div style="height: 32px; border-radius: 6px; background: oklch(78% .12 82);"></div><div style="height: 32px; border-radius: 6px; background: oklch(45% .19 280); outline: 2px dashed #d33;"></div></div><div style="font-size: 11px; color: #999; margin-top: 8px;">Fourth swatch is not in DESIGN.md</div></div>`,
    "Color outside DESIGN.md",
    "A literal color is outside the DESIGN.md palette and sidecar tonal ramps. This may be legitimate, but it should be an intentional design-system addition rather than drift.",
  ),
  "section-visual-details": CARD(
    "design-system-radius",
    `<div style="background: #fff; padding: 12px 16px; font-family: system-ui, sans-serif; color: #111;"><div style="font-size: 11px; color: #999; margin-bottom: 8px;">DESIGN.md radius scale: 4 &middot; 8 &middot; 12</div><div style="width: 64px; height: 64px; border: 2px solid #111; border-radius: 22px;"></div></div>`,
    "Radius outside DESIGN.md",
    "A border-radius value is outside the DESIGN.md rounded scale. Use a documented radius token or update the design system if the new shape is intentional.",
  ),
};

let added = 0;
for (const [section, card] of Object.entries(CARDS)) {
  const open = src.indexOf(`id="${section}"`);
  if (open === -1) {
    console.error(`section ${section} not found`);
    process.exit(1);
  }
  const close = src.indexOf("</section>", open);
  src = src.slice(0, close) + card.trimEnd() + "\n      " + src.slice(close);
  added++;
}
if (added !== 3) {
  console.error(`expected to add 3 cards, added ${added}`);
  process.exit(1);
}

// Sidebar + lede + description counts
const COUNT_FIXES = [
  ['<span class="anti-patterns-sidebar-count">46</span>', '<span class="anti-patterns-sidebar-count">44</span>'],
  ['<span class="anti-patterns-sidebar-count">7</span>', '<span class="anti-patterns-sidebar-count">5</span>'],
  ['<span class="anti-patterns-sidebar-count">10</span>', '<span class="anti-patterns-sidebar-count">11</span>'],
  ['<span class="anti-patterns-sidebar-count">5</span>', '<span class="anti-patterns-sidebar-count">6</span>'],
  ['<span class="anti-patterns-sidebar-count">8</span>', '<span class="anti-patterns-sidebar-count">6</span>'],
];
for (const [from, to] of COUNT_FIXES) {
  if (!src.includes(from)) {
    console.error(`count fix target not found (or already applied): ${from}`);
    process.exit(1);
  }
  src = src.replace(from, to);
}

fs.writeFileSync(FILE, src);
console.log("slop catalog synced: 44 cards (5 removed, 3 added), counts updated");
