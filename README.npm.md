# ZarishNoksha CLI

Give your agent a designer's vocabulary. Detect UI anti-patterns and design quality issues from the command line with no LLM and no API key. Scans HTML, CSS, JSX, TSX, Vue, and Svelte files for **44 deterministic rules**, including AI-generated UI tells, accessibility violations, and general design quality problems.

## Quick Start

```bash
# Install ZarishNoksha skills into your AI harness (Claude, Cursor, Gemini, etc.)
npx zarishnoksha install

# Non-interactive install for a specific scope
npx zarishnoksha install -y --providers=claude,codex --scope=project

# First command to run inside your AI harness
/zarishnoksha init

# Update skills to the latest version
npx zarishnoksha update

# Install or update skills without hook manifests
npx zarishnoksha install --no-hooks

# Link skills from a Git submodule checkout
npx zarishnoksha link --source=.zarishnoksha --providers=claude,cursor

# List all available commands
npx zarishnoksha help

# Scan files or directories for anti-patterns
npx zarishnoksha detect src/

# Scan a live URL (requires Puppeteer)
npx zarishnoksha detect https://example.com

# JSON output for CI/tooling
npx zarishnoksha detect --json src/

# Opt-in provider tells (signatures specific to a model family)
npx zarishnoksha detect --gpt src/
npx zarishnoksha detect --gemini src/
```

## What It Detects

**AI Slop Tells**: patterns that scream "AI generated this":
- Side-tab accent borders, gradient text on headings
- Purple/violet gradients and cyan-on-dark palettes
- Dark mode with glowing accents, border + border-radius clashes

**Typography Issues**: overused fonts (Inter, Roboto), flat type hierarchy, single font families

**Color & Contrast**: WCAG AA violations, gray text on colored backgrounds, pure black/white

**Layout & Composition**: nested cards, monotonous spacing, everything-centered layouts

**Motion**: bounce/elastic easing, layout property transitions

**Quality**: tiny body text, cramped padding, long line lengths, small touch targets

44 deterministic detector rules in total (26 slop, 18 quality) plus 4 opt-in provider tells behind `--gpt` and `--gemini`. See the full catalog at [zarishnoksha.pages.dev/slop](https://zarishnoksha.pages.dev/slop).

## Exit Codes

- `0`: no issues found
- `2`: anti-patterns detected

## Options

```
zarishnoksha detect [options] [file-or-dir-or-url...]

  --fast    Regex-only mode (skip the static HTML engine, faster but less accurate)
  --gpt     Enable GPT-specific provider tells
  --gemini  Enable Gemini-specific provider tells
  --json    Output findings as JSON
  --help    Show help
```

## Requirements

- Node.js 24+
- `puppeteer` (optional, only needed for URL scanning)

## Part of ZarishNoksha

This CLI is part of [ZarishNoksha](https://zarishnoksha.pages.dev), a cross-provider design skill pack for AI-powered development tools named for _zarish_ and **নকশা** (noksha), the Bengali word for "design". The full suite includes 1 skill with 23 commands for Claude Code, Cursor, GitHub Copilot, Gemini, Codex, and more.

## License

[Apache 2.0](https://github.com/arwazarish/zarishnoksha/blob/main/LICENSE)