# Contributing to zarishnoksha

## Quick Start (Devcontainer)
  - Open in VS Code → "Reopen in Container"
  - Wait for postCreateCommand (installs deps + browsers)
  - `bun run dev` → opens http://localhost:4321

## Quick Start (Manual)
  - Prerequisites: Node.js 24+, Bun (latest), Git
  - `bun install`
  - `bunx puppeteer browsers install chrome`
  - `npx playwright install --with-deps chromium`
  - Copy .env.example → .env (optional, for LLM-backed tests)
  - `bun run dev`

## Project Architecture
  - skill/ → source of truth for AI agent skill
  - cli/ → CLI tool + anti-pattern detection engine
  - site/ → Astro marketing/documentation site
  - extension/ → Chrome/Firefox DevTools extension
  - functions/ → Cloudflare Pages Functions (download API)
  - scripts/ → Build, release, and generation tooling
  - tests/ → Test suite (Bun + Node + Playwright + Puppeteer)
  - docs/ → Internal developer documentation
  - plugin/ → Claude plugin distribution (generated)
  - .{provider}/ → Generated provider harness directories

## Development Workflow
  - `bun run dev` → Astro dev server + dev API
  - `bun run build` → full build (skills + site)
  - `bun run build:browser` → browser detector bundle
  - `bun run build:extension` → extension bundle

## Testing
  - `bun run test` → default suite
  - `bun run test:core` → core tests
  - `bun run test:detector` → detector tests (needs Chrome)
  - `bun run test:framework` → framework fixture tests
  - `bun run test:live-e2e` → live E2E (needs Chromium + optional API keys)
  - `bun run test:skill-behavior` → LLM-backed (needs API keys, ~$0.50-1.50/run)
  - Node vs Bun split: jsdom/browser fixtures use `node --test`, rest uses `bun test`

## Code Style
  - ESM modules, semicolons, two-space indentation
  - No formatter/linter enforced — match surrounding code
  - Biome available (biome.json) for CSS Tailwind directives
  - Naming: lowercase kebab-case files, descriptive names

## Anti-Pattern Detection Rules (TDD)
  - 6-step process: fixture → failing test → rule entry → pure check → adapters → verify
  - Reference rules: side-tab, low-contrast, icon-tile-stack, flat-type-hierarchy
  - Both DOM and jsdom adapter paths must be wired

## Contributing Changes
  - Branch from main
  - Source changes go in skill/, cli/, site/, extension/, scripts/, tests/, docs/
  - Do NOT edit generated files (.{provider}/, plugin/, dist/, build/)
  - Run `bun run build` after changing skill/, transformer code, or user-facing counts
  - Run `bun run test` before submitting
  - PR template checklist: source updated, build passes, tests pass, tested with provider

## Commit Conventions
  - Short imperative subjects: "Fix: ...", "Add ...", "Improve ...", "Bump ..."
  - Focused commits explaining user-facing impact

## Release Process
  - Three independent version tracks: skill (vX.Y.Z), CLI (cli-vX.Y.Z), extension (ext-vX.Y.Z)
  - Bump manifest → add changelog to index.astro → commit → push → `bun run release:<component>`
  - Release script verifies: clean tree, unpushed HEAD, changelog entry, build outputs

## Environment Variables
  - See .env.example for all optional keys
  - All test suites skip cleanly when keys are absent
  - Core development requires zero API keys

## Useful Links
  - docs/DEVELOP.md — architecture deep-dive
  - docs/STYLE.md — editorial style guide
  - docs/HARNESSES.md — harness capability matrix
  - docs/adr-live-variant-mode.md — live mode architecture
  - DESIGN.md — Neo Kinpaku design system
  - PRODUCT.md — product brief