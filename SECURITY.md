# Security Policy

Security boundaries and disclosure process for the ZarishNoksha monorepo: the AI-agent skill, the CLI anti-pattern detector, the browser extension, the Astro site, and the Cloudflare Pages functions.

If you found a way to read a secret, deploy to someone else's account, or break a trust boundary that should hold, that is the report we want. Report it privately, below, before you share it anywhere public.

## Reporting a vulnerability

Report security issues privately using **GitHub private vulnerability reporting** for this repository:

1. Go to `https://github.com/arwazarish/zarishnoksha/security/advisories/new`
2. Fill in the form. Include:
   - What you found and where it lives (file path or endpoint).
   - A minimal reproduction. A short script or the exact request that triggers it.
   - Impact. What a real attacker could do with it, and how much it is worth to them.
   - Suggested fix, if you have one.

If you cannot use the form, email a report and reference "ZarishNoksha security" in the subject. Expect an acknowledgement within 72 hours and a triage decision within 1 week.

Do not open a public issue for an active vulnerability. That burns the fix window and potentially the accounts that depend on the credential involved.

## Supported versions

The repo ships three independently versioned components. Only the latest release of each is supported and receives security fixes. Backporting to older tags is done case by case, on request and only when the fix is trivial.

| Component | Supported version | Where it is published |
|---|---|---|
| Skill | latest `skill-v*` tag | GitHub release + `dist/universal.zip` |
| CLI | latest `cli-v*` tag | npm `zarishnoksha` |
| Extension | latest `ext-v*` tag | Chrome Web Store + `dist/extension.zip` |

Use the tagged releases. Pre-release branches and `main` are for development and can change without notice, including during a security fix.

## Scope

In scope:

- The CLI detector `cli/` and its pure rule engine.
- The browser detector bundle and the extension `extension/`.
- The skill source `skill/` and the generated provider bundles under `dist/` and the root harness folders.
- The Astro site `site/` and the Cloudflare Pages Functions `functions/`.
- The build, release, and provider transform scripts `scripts/`.

Out of scope, and not eligible for a security bounty:

- The demo projects under `demos/` and the framework fixtures under `tests/framework-fixtures/`. They are throwaway scaffolds that intentionally vendor sample code.
- Cosmetic issues with no security impact (styling, broken image links, copy typos).
- Denial-of-service on the static public Pages site that does not scale to affect other tenants.

## Vulnerability classes we care about most

Ranked by how much they would matter here:

1. **Supply chain.** A tampered or taken-over dependency, vendored font, released artifact, regenerated harness bundle, or CI action. This repo auto-generates many release artifacts from source, so integrity of the build is the crown jewel.
2. **Credential exposure.** A secret token (GitHub, npm, Cloudflare, R2, LLM provider keys) committed, logged, echoed in CI, or embedded in a published artifact.
3. **Executable content from untrusted input.** The live-mode feature runs a dev server and can apply edits and run scripts in a user's project. Tricking it into running attacker-supplied code is the highest-impact bug in the product, because a malicious webpage could weaponize it.
4. **Cross-origin / SSRF in the functions.** `functions/` proxies or downloads for the extension. Weak origin checks or unvalidated URLs become Server-Side Request Forgery or token theft.
5. **Script injection in the CLI.** Anti-pattern rules return snippets that surface in reports; a rule that interpolates attacker-controlled values into a shell could execute code.

## For maintainers: keeping credentials safe

A reminder that applies to every commit in this repo:

- **Rotate anything that touched a chat, a log, or a fork.** GitHub, npm, Cloudflare, and R2 tokens that were ever printed in a conversation pasted into this project must be revoked and recreated using the click-by-click steps in `CONFIGURATION.md`. Rotate on a schedule and after any departure.
- **Never commit secrets.** `.env`, `.env.*` (except `.env.example`), and real tokens belong in GitHub Actions secrets, not in files. If you need a value locally, put it in an untracked `.env` and reference it from `.env.example` as a commented placeholder.
- **Scope tokens to the minimum.** The Cloudflare token gets `Cloudflare Pages: Edit` on this account only. The npm path uses Trusted Publishing via OIDC where possible, so no long-lived npm token needs to exist at all. The `SYNC_GENERATED_OUTPUT_TOKEN` PAT gets `Contents: read/write` on this repository only.
- **Least-privilege CI.** The workflows grant `permissions` at the job level and pin to released action tags. Do not widen `pull_request_target` or add broad cloud credentials to a publish-capable job.

## Security checklist for contributors

Before merging a PR, confirm:

- No new stdout or log line prints a secret or an auth header.
- Any code that runs `exec`, `spawn`, `eval`, or writes to a user path validates its input first.
- Changes to `skill/`, `scripts/`, or the rule engine are reflected in the regenerated artifacts (run `bun run build:browser` and `bun run build:extension`), so the browser and Node paths do not drift.
- New anti-pattern rules are pure functions that return snippets; they must not touch the DOM or execute strings from web pages.

## Security features you can rely on

Enabled for this repository:

- **Dependabot** opens grouped PRs for npm and GitHub Actions updates (`.github/dependabot.yml`).
- **Secret scanning and push protection** are the recommended setting for `main` (see `CONFIGURATION.md` Part F).
- **Branch protection** on `main` requires a reviewed PR before merge (see `CONFIGURATION.md` Part E).
- **GitHub Environments** gate the production deploy and the npm publish with required reviewers.

If any of these is off, enabling it is a pending security task, not a choice.

## Thanks

Responsible disclosure keeps this project and the people who run it safe. Report privately, give clear reproductions, and give maintainers the fix window before you publicize.
