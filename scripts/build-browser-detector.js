#!/usr/bin/env node

/**
 * Generates cli/engine/detect-antipatterns-browser.js (and the site copy under
 * site/public/js/) by concatenating the browser-safe detector modules and
 * wrapping them in an IIFE.
 *
 * Run: node scripts/build-browser-detector.js
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { buildBrowserDetectorBundle } from "./lib/browser-detector-bundle.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

const OUTPUT = path.join(ROOT, "cli/engine/detect-antipatterns-browser.js");
const SITE_OUTPUT = path.join(ROOT, "site/public/js/detect-antipatterns-browser.js");

const header = `/**
 * Anti-Pattern Browser Detector for zarishnoksha
 * Copyright (c) 2026 Arwa Zarish ISLAM
 * SPDX-License-Identifier: Apache-2.0
 *
 * GENERATED -- do not edit. Source: cli/engine/browser/injected/index.mjs
 * Rebuild: node scripts/build-browser-detector.js
 *
 * Usage: <script src="detect-antipatterns-browser.js"></script>
 * Re-scan: window.zarishnokshaScan()
 */`;

const output = buildBrowserDetectorBundle(ROOT, header);

fs.writeFileSync(OUTPUT, output);
fs.mkdirSync(path.dirname(SITE_OUTPUT), { recursive: true });
fs.writeFileSync(SITE_OUTPUT, output);
console.log(`Generated ${path.relative(ROOT, OUTPUT)} (${(output.length / 1024).toFixed(1)} KB)`);
console.log(`Generated ${path.relative(ROOT, SITE_OUTPUT)} (${(output.length / 1024).toFixed(1)} KB)`);
