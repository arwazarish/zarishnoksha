# ZarishNoksha

Give your agent a designer's vocabulary: 1 skill, 23 commands, live browser iteration, and 44 deterministic anti-pattern rules for AI-generated frontend design.

> **ZarishNoksha** (_zarish_, and **নকশা** (noksha), Bengali for "design") is a design skill pack that makes AI coding tools produce interfaces that look and feel hand-made instead of template-soufflé.

## Quick Start (no experience needed)

You do not need any design background, and you do not need a browser. Three steps, about ten minutes.

**Step 1: Install the skill.** In your project's terminal:

```bash
npx zarishnoksha install
```

This detects your AI tool (Claude Code, Cursor, Codex, Gemini CLI, GitHub Copilot, and more), installs the `zarishnoksha` skill where that tool looks for skills, and can also install an automatic design hook. Reload your tool afterward.

**Step 2: Run `/zarishnoksha init` once.** Open your AI tool and run:

```
/zarishnoksha init
```

Answer a few plain questions (brand surface, like a landing page or portfolio, or product surface, like app UI or a dashboard), and ZarishNoksha writes `PRODUCT.md` and offers `DESIGN.md`. Those two files are the memory every later command reads, so it stops guessing your audience, palette, tone, and type.

**Step 3: Polish an existing page.** Point a command at anything you already have:

```
/zarishnoksha polish the pricing page
```

That is the whole loop: one setup, a shared vocabulary, deterministic checks, live iteration.

> **On the GitHub Copilot app?** ZarishNoksha is built in. Skip the install and enable it under Settings → Experimental.

---

## What is ZarishNoksha?

Anthropic's [frontend-design](https://github.com/anthropics/skills/tree/main/skills/frontend-design) was the first widely-used design skill for Claude. ZarishNoksha started from there and grew into a cross-provider skill pack with its own deterministic detector.

Why it exists: every model trained on the same SaaS templates produces the same handful of tells: Inter for everything, purple-to-blue gradients, cards nested in cards, gray text on colored backgrounds, a rounded-square icon tile above every heading. Skipping the guidance gives the same result on every project.

ZarishNoksha adds:

- **One setup flow.** `/zarishnoksha init` writes `PRODUCT.md` and offers `DESIGN.md`, so later commands know the audience, brand/product register, voice, anti-references, colors, type, and components.
- **23 commands.** A shared design vocabulary with your AI: `polish`, `audit`, `critique`, `distill`, `animate`, `bolder`, `quieter`, and more.
- **44 deterministic detector rules.** The CLI and browser extension scan for these **without an LLM and without an API key**: pure, reproducible, and CI-friendly.

## The Skill: `/zarishnoksha`

The skill installs as a single command:

```bash
/zarishnoksha <command> <target>
```

All 23 commands are accessed through it:

| Command | What it does |
|---------|--------------|
| `/zarishnoksha craft` | Full shape-then-build flow with visual iteration |
| `/zarishnoksha init` | One-time setup: gather design context, write PRODUCT.md and DESIGN.md, configure live mode, recommend next steps |
| `/zarishnoksha document` | Generate root DESIGN.md from existing project code |
| `/zarishnoksha extract` | Pull reusable components and tokens into the design system |
| `/zarishnoksha shape` | Plan UX/UI before writing code |
| `/zarishnoksha critique` | UX design review: hierarchy, clarity, emotional resonance |
| `/zarishnoksha audit` | Run technical quality checks (a11y, performance, responsive) |
| `/zarishnoksha polish` | Final pass, design system alignment, and shipping readiness |
| `/zarishnoksha bolder` | Amplify boring designs |
| `/zarishnoksha quieter` | Tone down overly bold designs |
| `/zarishnoksha distill` | Strip to essence |
| `/zarishnoksha harden` | Error handling, i18n, text overflow, edge cases |
| `/zarishnoksha onboard` | First-run flows, empty states, activation paths |
| `/zarishnoksha animate` | Add purposeful motion |
| `/zarishnoksha colorize` | Introduce strategic color |
| `/zarishnoksha typeset` | Fix font choices, hierarchy, sizing |
| `/zarishnoksha layout` | Fix layout, spacing, visual rhythm |
| `/zarishnoksha delight` | Add moments of joy |
| `/zarishnoksha overdrive` | Add technically extraordinary effects |
| `/zarishnoksha clarify` | Improve unclear UX copy |
| `/zarishnoksha adapt` | Adapt for different devices |
| `/zarishnoksha optimize` | Performance improvements |
| `/zarishnoksha live` | Visual variant mode: iterate on elements in the browser |

Use `/zarishnoksha pin <command>` to create standalone shortcuts (e.g., `pin audit` creates `/audit`).

Or ask directly:

```
/zarishnoksha redo this hero section
```

### Anti-Patterns

The skill includes explicit guidance on what to avoid:

- Don't use overused fonts (Arial, Inter, system defaults)
- Don't use gray text on colored backgrounds
- Don't use pure black/gray (always tint)
- Don't wrap everything in cards or nest cards inside cards
- Don't use bounce/elastic easing (feels dated)

## The Detector: 44 Rules

ZarishNoksha ships a deterministic rule engine that flags **44 anti-patterns** in two categories: **slop** (patterns that scream "AI generated this": side-tab borders, purple gradients, bounce easing, dark glows) and **quality** (long line lengths, cramped padding, small touch targets, skipped headings). All 44 run without an LLM. Four opt-in "provider tells" (signatures specific to a model family) are available behind `--gpt` and `--gemini`.

The engine runs in three places from one source:

1. **The CLI**: `npx zarishnoksha detect` on files, folders, or live URLs, with `--json` output for CI.
2. **The browser extension**: scan any page and see every finding highlighted in place.
3. **The design hook**: automatic detection when your agent edits UI files.

See the full catalog with before/after examples at [zarishnoksha.pages.dev/slop](https://zarishnoksha.pages.dev/slop).

## Installation

### Option 1: CLI installer (Recommended)

From the root of your project, run:

```bash
npx zarishnoksha install
```

This shows the harness folders it detected (for example `~/.claude`, `~/.codex`, or project-local `.cursor`), lets you keep the detected set or customize providers, then asks whether to install into the current project or globally. Use `--providers=claude,codex,cursor` and `--scope=project|global` to skip those choices in scripts. On Claude Code, Cursor, and Codex, it also installs the provider-native hook manifest for the current project. Reload your harness afterward.

To refresh an existing install:

```bash
npx zarishnoksha update
```

Codex users should open `/hooks` after install or update and approve the project hook when prompted. Codex tracks trust by hook definition, so updates that change `.codex/hooks.json` can require approval again.

### Option 2: Git Submodule

For teams that want to keep ZarishNoksha vendored and updated through Git, add this repo as a submodule and link the compiled provider build into your harness folders:

```bash
git submodule add https://github.com/arwazarish/zarishnoksha .zarishnoksha
npx zarishnoksha link --source=.zarishnoksha --providers=claude,cursor
git add .gitmodules .zarishnoksha .claude .cursor
git commit -m "Add ZarishNoksha skills"
```

Use the providers your project needs, for example `claude`, `cursor`, `gemini`, `codex`, `github`, `opencode`, `pi`, `qoder`, `trae`, `trae-cn`, or `rovo-dev`. The command links individual skill folders from `.zarishnoksha/dist/universal/` and leaves existing real skill directories untouched unless you pass `--force`.

To update later:

```bash
git submodule update --remote .zarishnoksha
npx zarishnoksha link --source=.zarishnoksha --providers=claude,cursor
```

### Option 3: Download from Website

Visit [ZarishNoksha](https://zarishnoksha.pages.dev), download the ZIP for your tool, and extract to your project.

### Option 4: Copy from Repository

**Cursor:**
```bash
cp -r dist/cursor/.cursor your-project/
```

> **Note:** Cursor skills require setup:
> 1. Switch to Nightly channel in Cursor Settings → Beta
> 2. Enable Agent Skills in Cursor Settings → Rules
>
> [Learn more about Cursor skills](https://cursor.com/docs/context/skills)

**Claude Code:**
```bash
# Project-specific
cp -r dist/claude-code/.claude your-project/

# Or global (applies to all projects)
cp -r dist/claude-code/.claude/* ~/.claude/
```

**OpenCode:**
```bash
cp -r dist/opencode/.opencode your-project/
```

**Pi:**
```bash
cp -r dist/pi/.pi your-project/
```

**Gemini CLI:**
```bash
cp -r dist/gemini/.gemini your-project/
```

> **Note:** Gemini CLI skills require setup:
> 1. Install preview version: `npm i -g @google/gemini-cli@preview`
> 2. Run `/settings` and enable "Skills"
> 3. Run `/skills list` to verify installation
>
> [Learn more about Gemini CLI skills](https://geminicli.com/docs/cli/skills/)

**Codex CLI:**
```bash
# Project-local
cp -r dist/agents/.agents your-project/
mkdir -p your-project/.codex
cp dist/codex/.codex/hooks.json your-project/.codex/hooks.json

# Or install the skill user-wide. Copy .codex/hooks.json into each project
# where you want the design hook to run.
mkdir -p ~/.agents/skills
cp -r dist/agents/.agents/skills/* ~/.agents/skills/
```

> The asset-producer subagent ships nested inside the skill's own `agents/` folder, which Codex auto-discovers. No separate `.codex/agents/` copy is needed. The hook is project-local because Codex discovers hooks from `.codex/hooks.json` next to trusted project config.

**GitHub Copilot:**
```bash
cp -r dist/github/.github your-project/
```

**Trae:**
```bash
# Trae China (domestic version)
cp -r dist/trae/.trae-cn/skills/* ~/.trae-cn/skills/

# Trae International
cp -r dist/trae/.trae/skills/* ~/.trae/skills/
```

> **Note:** Trae has two versions with different config directories:
> - **Trae China**: `~/.trae-cn/skills/`
> - **Trae International**: `~/.trae/skills/`
>
> After copying, restart Trae IDE to activate the skills.

**Rovo Dev:**
```bash
# Project-specific
cp -r dist/rovo-dev/.rovodev your-project/

# Or global (applies to all projects)
cp -r dist/rovo-dev/.rovodev/skills/* ~/.rovodev/skills/
```

**Qoder:**
```bash
# Project-specific
cp -r dist/qoder/.qoder your-project/

# Or global (applies to all projects)
cp -r dist/qoder/.qoder/skills/* ~/.qoder/skills/
```

## Usage

Once installed, every command runs through the single `/zarishnoksha` skill:

```
/zarishnoksha audit        # Find issues
/zarishnoksha polish       # Final cleanup
/zarishnoksha distill      # Remove complexity
/zarishnoksha critique     # Full design review
```

Type `/zarishnoksha` alone to see the full command list.

Most commands accept an optional argument to focus on a specific area:

```
/zarishnoksha audit the header
/zarishnoksha polish the checkout form
```

If you reach for one command often, pin it with `/zarishnoksha pin audit` to get `/audit` as a standalone shortcut.

**Note:** Codex uses skills here, not `/prompts:` commands. Open `/skills` or type `$zarishnoksha`. Repo-local installs live in `.agents/skills/`; user-wide installs live in `~/.agents/skills/`. GitHub Copilot uses `.github/skills/`. Restart the tool if a newly installed skill does not appear.

## Design hook

On Claude Code, GitHub Copilot, Codex, and Cursor, `npx zarishnoksha install` and `npx zarishnoksha update` install a provider-native hook manifest along with the skill payload. The hook runs the ZarishNoksha design detector on direct UI file edits and surfaces findings back into the agent flow. Claude Code, GitHub Copilot, and Codex surface findings after the edit. Cursor blocks bad proposed writes before they land.

Installed hook surfaces:

- Claude Code: `.claude/settings.local.json` (gitignored, machine-local) runs `${CLAUDE_PROJECT_DIR}/.claude/skills/zarishnoksha/scripts/hook.mjs`. A hook moved into the shared `settings.json` is honored in place.
- GitHub Copilot: `.github/hooks/zarishnoksha.json` (committed, shared by the Copilot CLI and the cloud agent) runs `.github/skills/zarishnoksha/scripts/hook.mjs`. The Copilot CLI activates it once the file is on the repository's default branch and the folder is trusted.
- Cursor: `.cursor/hooks.json` runs `.cursor/skills/zarishnoksha/scripts/hook-before-edit.mjs`.
- Codex: `.codex/hooks.json` runs `.agents/skills/zarishnoksha/scripts/hook.mjs`.

The installer preserves unrelated hook entries and settings. If a hook manifest is malformed, install/update aborts by default; rerun with `--force` to back up the malformed file as `.bak` and replace it.

On an interactive `install`/`update`, ZarishNoksha explains the hook and offers to install it (default yes). Your choice is remembered per-developer in the gitignored `.zarishnoksha/config.local.json`, so you are not asked again; `--no-hooks` skips it for that run without recording anything. Hook lifecycle settings live under the `hook` key of `.zarishnoksha/config.json`; detector ignores live under `detector`, shared by `/zarishnoksha hooks` and `npx zarishnoksha detect`.

For debugging, set `hook.auditLog` in `.zarishnoksha/config.json` to a path (or the legacy `zarishnoksha_HOOK_LOG` env var) to write one NDJSON line per hook invocation. Leave it unset for normal use.

Codex requires one platform step that ZarishNoksha cannot safely skip: open `/hooks` after install or update and approve the project hook. There is no Codex marketplace/plugin install flow for this hook.

Full hook docs: [zarishnoksha.pages.dev/docs/hooks](https://zarishnoksha.pages.dev/docs/hooks).

Manual copy commands are fallback/debug instructions. The normal path is:

```bash
npx zarishnoksha install
npx zarishnoksha update
```

## CLI

ZarishNoksha includes a standalone CLI for detecting anti-patterns without an AI harness:

```bash
npx zarishnoksha detect src/                   # scan a directory
npx zarishnoksha detect index.html             # scan an HTML file
npx zarishnoksha detect https://example.com    # scan a live URL
npx zarishnoksha detect --json .               # CI-friendly JSON output
npx zarishnoksha detect --no-config src/       # raw scan, ignoring project config/context
npx zarishnoksha ignores list                  # show detector ignores
npx zarishnoksha ignores add-file "src/legacy/**"
npx zarishnoksha ignores add-value overused-font Inter --reason "Brand font"
```

The detector catches 44 deterministic issues across AI slop (side-tab borders, purple gradients, bounce easing, dark glows) and general design quality (line length, cramped padding, small touch targets, skipped headings, and more).

By default, `detect` respects the same `.zarishnoksha/config.json` and `.zarishnoksha/config.local.json` detector config as the design hook: `detector.ignoreRules`, `detector.ignoreFiles`, `detector.ignoreValues`, and `detector.designSystem.enabled`. Hook lifecycle settings such as `hook.enabled` only affect automatic hook execution.

For a waiver that should travel with one file instead of the repo config, add an inline comment in the file: `<!-- zarishnoksha-disable overused-font: exported brand doc -->`. The marker works in any comment syntax, scopes to the whole file (or one line with `zarishnoksha-disable-line` / `zarishnoksha-disable-next-line`), and is bypassed by `--no-inline-ignores` or `--no-config`.

Full detector docs: [zarishnoksha.pages.dev/docs/detector](https://zarishnoksha.pages.dev/docs/detector).

## See It In Action

Visit [zarishnoksha.pages.dev](https://zarishnoksha.pages.dev) for before/after case studies, the full 44-rule catalog, and the detector lab, or [zarishnoksha.pages.dev/designing](https://zarishnoksha.pages.dev/designing) to read about the design loop in detail.

## Supported Tools

- [Cursor](https://cursor.com)
- [Claude Code](https://claude.ai/code)
- [GitHub Copilot](https://github.com/features/copilot)
- [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Codex CLI](https://github.com/openai/codex)
- [OpenCode](https://opencode.ai)
- [Pi](https://pi.dev)
- [Kiro](https://kiro.dev)
- [Trae](https://trae.ai)
- [Rovo Dev](https://www.atlassian.com/software/rovo)
- [Qoder](https://qoder.com)

## Community & Ecosystem

- GitHub Discussions: file bugs, request features, and help newcomers.
- [zarishnoksha on npm](https://www.npmjs.com/package/zarishnoksha): grab the CLI, follow releases, and star the package.
- Follow [@arwazarish on X](https://x.com/arwazarish) for release notes, sample lint reports, and video highlights of new rules.

## Contributing

See [DEVELOP.md](docs/DEVELOP.md) for contributor guidelines and build instructions.

## License

Apache 2.0. See [LICENSE](LICENSE).

---

Owner [Arwa Zarish ISLAM](https://github.com/arwazarish)

Developer [Mohammad Ariful ISLAM](https://github.com/codeandbrain), *proud father of [Arwa Zarish ISLAM](https://github.com/arwazarish)*
