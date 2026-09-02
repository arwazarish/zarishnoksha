import fs from "fs";
import path from "path";

/**
 * Shared builder for the browser-safe anti-pattern detector bundle.
 *
 * Concatenates the browser-safe detector modules into a single IIFE-wrapped
 * script (with imports/exports stripped) that can run in a browser or
 * extension context. Shared by:
 *   - scripts/build-browser-detector.js  (CLI/site bundle)
 *   - scripts/build-extension.js         (Chrome/Firefox extension bundle)
 *
 * Keeping the module list and the browser-safety transform here so a change to
 * the detector's bundle shape stays in sync across both outputs.
 */

export const BROWSER_MODULES = [
  "cli/engine/shared/constants.mjs",
  "cli/engine/registry/antipatterns.mjs",
  "cli/engine/shared/color.mjs",
  "cli/engine/rules/checks.mjs",
  "cli/engine/browser/injected/index.mjs",
];

/** Strip import/export statements and extract only the ANTIPATTERNS array from the registry. */
export function browserSafeModule(rootDir, relPath) {
  let code = fs.readFileSync(path.join(rootDir, relPath), "utf-8");
  if (relPath === "cli/engine/registry/antipatterns.mjs") {
    const match = code.match(/const ANTIPATTERNS = \[[\s\S]*?\n\];/);
    if (!match) throw new Error("Could not extract browser antipattern registry");
    code = match[0];
  }
  code = code.replace(/^import[\s\S]*?;\n/gm, "");
  code = code.replace(/^export\s+\{[\s\S]*?^};\n?/gm, "");
  return `  // --- ${relPath} ---\n${code.trim()}\n`;
}

/**
 * Build the full IIFE-wrapped bundle string.
 * @param {string} rootDir Repo root (for resolving module paths).
 * @param {string} header  License/usage banner prepended to the output.
 */
export function buildBrowserDetectorBundle(rootDir, header) {
  const code = BROWSER_MODULES.map((relPath) => browserSafeModule(rootDir, relPath)).join("\n");
  return `${header}
(() => {
if (typeof window === 'undefined') return;
${code}
})();
`;
}
