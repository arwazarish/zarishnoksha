# ZARISHNOKSHA configuration Guide

Complete, click-by-click guide to create every required credential and wire the GitHub Actions pipelines so that **GitHub becomes the command centre** for building, testing, publishing to npm, and deploying to Cloudflare Pages.

Everything here is as-current as of September 2026 and follows GitHub / Cloudflare / npm security best practices:

- Least-privilege credentials (fine-grained PATs, scoped API tokens)
- Tokenless publishing where possible (npm Trusted Publishing via OIDC)
- GitHub Environments with required reviewers for production deploys
- SHA-pinned third-party actions
- Workflow-level `permissions` (deny by default)
- Dependabot for dependency and action updates

> **Security note before you start:** all tokens shown in earlier chat messages are **compromised and must be rotated**. This guide has you create NEW tokens. Do not reuse anything pasted into chat.

---

## Table of contents

1. [Overview of the pipeline](#1-overview-of-the-pipeline)
2. [Prerequisites](#2-prerequisites)
3. [Part A - GitHub repository setup](#part-a---github-repository-setup)
4. [Part B - Cloudflare Pages credentials](#part-b---cloudflare-pages-credentials)
5. [Part C - npm credentials (two options)](#part-c---npm-credentials-two-options)
6. [Part D - GitHub Actions secrets and variables](#part-d---github-actions-secrets-and-variables)
7. [Part E - GitHub Environments and branch protection](#part-e---github-environments-and-branch-protection)
8. [Part F - Dependabot + secret scanning](#part-f---dependabot--secret-scanning)
9. [Part G - GitHub MCP server (local development)](#part-g---github-mcp-server-local-development)
10. [Part H - Re-enable and run the workflows](#part-h---re-enable-and-run-the-workflows)
11. [Workflow reference](#11-workflow-reference)
12. [Secrets quick-reference table](#12-secrets-quick-reference-table)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Overview of the pipeline

Three workflows live in `.github/workflows/` and are currently **disabled** (`if: false`). Once you complete this guide you will re-enable them.

| Workflow | Triggers | What it does | Needs |
|---|---|---|---|
| `ci.yml` | Push to `main`, PR to `main` | Lint, core tests, detector tests, live tests, framework tests, build, build extension, verify generated tracked outputs, upload dist | nothing (uses GITHUB_TOKEN) |
| `deploy-cloudflare.yml` | Push to `main` | Build site and deploy `build/` to `zarishnoksha.pages.dev` | `CLOUDFLARE_API_TOKEN` secret, `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_PROJECT_NAME` variables |
| `sync-generated-output.yml` | Push (source changes), dispatch | Rebuild harness folders, commit + push if drifted | `SYNC_GENERATED_OUTPUT_TOKEN` PAT (recommended) |

Two more workflows you may add (scaffolded in this guide):

| Workflow | Triggers | What it does | Needs |
|---|---|---|---|
| `npm-publish.yml` | Push of tag `cli-v*` | Publish CLI to npm | npm trusted publisher (OIDC) OR `NPM_TOKEN` |
| `dependabot.yml` (not a workflow) | Scheduled by GitHub | Open PRs for dependency + action updates | nothing |

**"GitHub is the command centre"** means: push to `main` (or a reviewed PR) triggers everything automatically. You only touch the browser dashboards once to create the credentials below.

---

## 2. Prerequisites

- The repository is already at `git@github.com:arwazarish/zarishnoksha.git` on branch `main` (done).
- You have login access to **github.com**, **npmjs.com**, and **dash.cloudflare.com**.
- A browser on the machine where you'll do the click-through steps.
- Renew ~tokens first: GitHub PATs, Cloudflare API token, npm token (all previously leaked).

---

## PART A - GitHub repository setup

Do these once, mostly in the GitHub web UI.

### A1. Confirm the repo exists and is public (or private)

1. Go to `https://github.com/arwazarish/zarishnoksha`.
2. Confirm `main` branch shows your pushed commits.
3. Repository visibility: your choice. If **private**, you must add `actions: read` to the `ci.yml` deploy job (see workflow reference). The Cloudflare and npm integrations work either way, though npm Trusted Publishing requires a **public** repository.

### A2. Rotate the leaked GitHub PATs (both)

1. Go to `https://github.com/settings/tokens` (Classic tokens).
2. For each leaked classic token (`ghp_kheIt...`): click it, scroll to bottom, **Delete token**.
3. Go to `https://github.com/settings/personal-access-tokens` (Fine-grained tokens).
4. For the leaked fine-grained PAT (`github_pat_11BV...`): **Revoke** / delete it.
5. Do **not** immediately recreate them; you'll create the exact tokens you need in Part G (MCP server) and the `SYNC_GENERATED_OUTPUT_TOKEN` below.

### A3. Create the `SYNC_GENERATED_OUTPUT_TOKEN` (fine-grained PAT)

This token lets the `sync-generated-output.yml` workflow push generated output back to `main` and **re-trigger** dependent workflows (a default `GITHUB_TOKEN` suppresses follow-up runs).

1. Go to `https://github.com/settings/personal-access-tokens/new`
2. **Token name**: `zarishnoksha-sync-generated-output`
3. **Expiration**: choose 90 days or custom (renew on rotation).
4. **Resource owner**: your personal account `arwazarish`.
5. **Repository access**: `Only select repositories` → select `arwazarish/zarishnoksha`.
6. **Permissions → Repository permissions**:
   - **Contents**: `Read and write`
7. Click **Generate token**, copy the value (starts with `github_pat_`). You'll paste it into a GitHub secret in Part D (name `SYNC_GENERATED_OUTPUT_TOKEN`).

---

## PART B - Cloudflare Pages credentials

Your Pages project `zarishnoksha` already exists at `zarishnoksha.pages.dev`. You need exactly two values: **Account ID** (not secret) and a scoped **API token** (secret).

### B1. Find your Account ID

1. Sign in to `https://dash.cloudflare.com/`.
2. On the right sidebar, find the **Account ID** (or read it from the URL: `https://dash.cloudflare.com/<ACCOUNT_ID>/...`).
3. Your account ID per the project info is `79fd64f8d775aec784a194999085f146`. Record it.

### B2. Rotate the leaked Cloudflare API token and create a scoped one

The token pasted in chat (`cfat_uXY5...`) is compromised. Replace it:

1. Go to `https://dash.cloudflare.com/profile/api-tokens`.
2. Find the leaked token (`zarishnoksha-pages` or whatever it was named) and **Roll** or **Delete** it.
3. Click **Create Token**.
4. Under **Custom token**, click **Get started**.
5. **Token name**: `zarishnoksha-pages-deploy`
6. **Permissions** (add):
   - Account → **Cloudflare Pages** → **Edit**
7. **Account Resources**: Include → select your account (`arwazarish` / the account containing the Pages project).
8. Click **Continue to summary** → **Create Token**.
9. Copy the token value. It starts with `cfat_` (new format). You'll paste it as a secret `CLOUDFLARE_API_TOKEN` in Part D.

> **Scope it to the account only.** Do not add zone/worker/etc. permissions. Least privilege.

### B3. (Optional) Verify the token

```bash
curl -H "Authorization: Bearer <TOKEN_VALUE>" \
  "https://api.cloudflare.com/client/v4/accounts/79fd64f8d775aec784a194999085f146/tokens/verify"
```

Should return `"status":"active"`.

---

## PART C - npm credentials (two options)

Two ways to publish. **Option 1 (Trusted Publishing via OIDC) is recommended for 2026** — it removes the long-lived token entirely. Option 2 is the fallback if you prefer a classic token.

### Option 1 (RECOMMENDED) - npm Trusted Publishing via OIDC

No npm token is stored anywhere. GitHub mints a short-lived credential each run.

> Requirement: npm CLI 11.5.1+ and Node 22.14+. Your package requires Node 24, so you're fine.

1. First, the package must already exist on npm. You will do **one manual first publish**:
   ```bash
   cd ~/zarishnoksha
   bun install
   bun run prepack          # swaps README.npm.md into README.md
   npm publish               # you will be prompted for your npm password/2FA
   bun run postpack          # restores the repo README
   ```
2. Confirm the package appears at `https://www.npmjs.com/package/zarishnoksha`.
3. On the package page, click **Settings** (the gear).
4. Scroll to **Trusted Publisher** and click **Add trusted publisher**.
5. Fill in:
   - **Provider**: `GitHub`
   - **Owner / Organization**: `arwazarish`
   - **Repository**: `zarishnoksha`
   - **Workflow name**: `npm-publish.yml`  (create this file in Part H / workflow reference)
   - **Environment**: leave blank (or `npm-publish` if you set one)
6. Click **Add trusted publisher**.
7. Under **Publishing access**, set it to **Require 2FA** and save.
8. In the existing/leaked npm token (`npm_Vf5o...`), go to `https://www.npmjs.com/settings/arwazarish/tokens` and **delete** it (no longer needed).

Your `npm-publish.yml` workflow must set `permissions: id-token: write`. See the workflow reference.

### Option 2 (fallback) - npm Granular Access Token

Use only if Trusted Publishing is not workable for you.

1. Go to `https://www.npmjs.com/settings/arwazarish/tokens`.
2. Delete the leaked token (`npm_Vf5o...`).
3. Click **Generate New Token** → **Granular Access Token**.
4. **Token name**: `zarishnoksha-ci`
5. **Expiration**: 90 days or custom.
6. **Packages and scopes**: All packages (or just `zarishnoksha` RW).
7. **Permissions**: `Read and write`.
8. **2FA**: **uncheck** "Bypass 2FA for automation" if it is checked — this forces OTP on publish. (You will enable 2FA for publishing in npm settings.)
9. Click **Generate token**, copy it (`npm_...`). Save as GitHub secret `NPM_TOKEN` in Part D.

---

## PART D - GitHub Actions secrets and variables

Store credentials as GitHub **secrets** (sensitive) and non-secrets as **variables**.

### How to add a secret

1. Go to `https://github.com/arwazarish/zarishnoksha/settings/secrets/actions`.
2. Click **New repository secret**.
3. Name + Value + **Add secret**.

### How to add a variable

1. Go to `https://github.com/arwazarish/zarishnoksha/settings/variables/actions`.
2. Click **New repository variable**.
3. Name + Value + **Add variable**.

### Secrets to add

| Secret name | Value | Source |
|---|---|---|
| `CLOUDFLARE_API_TOKEN` | `<your scoped Cloudflare API token>` | Part B2 |
| `SYNC_GENERATED_OUTPUT_TOKEN` | `<your fine-grained PAT>` | Part A3 |

(These two are what the currently-existing workflows need. `NPM_TOKEN` only if you chose npm Option 2.)

### Variables to add

| Variable name | Value | Source |
|---|---|---|
| `CLOUDFLARE_ACCOUNT_ID` | `79fd64f8d775aec784a194999085f146` | Part B1 |
| `CLOUDFLARE_PROJECT_NAME` | `zarishnoksha` | Pages project name |

> `CLOUDFLARE_ACCOUNT_ID` is **not** a secret (it appears in every Pages URL). Store it as a variable, not a secret – this is the 2026 best practice and lets the value show in logs for debugging.

---

## PART E - GitHub Environments and branch protection

### E1. Create GitHub Environments

Environments let you gate deploys/publishes with reviewers and separate secrets.

1. Go to `https://github.com/arwazarish/zarishnoksha/settings/environments`.
2. Click **New environment**, name it `production`, create.
3. In the `production` environment page:
   - **Deployment branches**: `Selected branches` → `main`.
   - **Required reviewers**: add yourself (`arwazarish`) so deploys need approval.
   - (Optional) **Wait timer**: 0-10 minutes.
4. Repeat to create `preview` (no protection rules needed) if you add PR-preview deploys.

Environment secrets live under the environment page (`.../settings/environments/production/secrets`). Put production-only credentials there if you want extra gating. For this project, repo-level secrets suffice.

### E2. Protect the `main` branch

1. Go to `https://github.com/arwazarish/zarishnoksha/settings/branches`.
2. Under **Branch protection rules**, click **Add branch protection rule**.
3. **Branch name pattern**: `main`.
4. Enable:
   - **Require a pull request before merging** → require 1 approval.
   - **Require status checks to pass before merging** → select `ci` (or whatever the CI job name is; the "changes" job's dependents). If the checks don't appear yet, add them after the first CI run.
   - **Require branches to be up to date before merging**.
   - **Do not allow bypassing the above settings** (optional, stricter).
5. Save.

---

## PART F - Dependabot + secret scanning

### F1. Enable dependency graph and Dependabot

1. Go to `https://github.com/arwazarish/zarishnoksha/settings/security_analysis`.
2. Enable:
   - **Dependency graph** (needed for alerts).
   - **Dependabot alerts**.
   - **Dependabot security updates**.
   - **Secret scanning** and **Push protection**.

### F2. Add a Dependabot config file

Create `.github/dependabot.yml` in the repo:

```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:00"
    open-pull-requests-limit: 10
    versioning-strategy: increase
    groups:
      safe-updates:
        applies-to: version-updates
        patterns: ["*"]
        update-types: ["patch", "minor"]

  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
      time: "06:30"
    open-pull-requests-limit: 5
    groups:
      actions:
        patterns: ["*"]
```

This keeps both npm dependencies and GitHub Actions versions up to date with minimal-noise grouped PRs.

> Note: the repo uses `bun.lock`. Dependabot supports npm ecosystem; it will also update `bun.lock` if `dependabot.yml` uses `package-ecosystem: "npm"` and Bun is detected (Bun support landed in Dependabot for `bun.lock` in 2025). If not picked up, add a small `package.json`-driven flow or rely on the grouped bump.

---

## PART G - GitHub MCP server (local development)

The official GitHub MCP server (`github/github-mcp-server`) is imported into your VS Code via `.vscode/mcp.json`. The old npm package `@modelcontextprotocol/server-github` is **discontinued** (April 2025), so we use the official one.

### G1. Create a fine-grained PAT for local MCP use

1. `https://github.com/settings/personal-access-tokens/new`
2. **Token name**: `zarishnoksha-mcp-local`
3. Resource owner `arwazarish`, repository `arwazarish/zarishnoksha`.
4. Permissions (Repository):
   - **Contents**: Read and write
   - **Issues**: Read and write
   - **Pull requests**: Read and write
   - **Administration**: Read (to browse repo settings) — optional
5. Generate, copy token.

### G2. Wire it into VS Code

`.vscode/mcp.json` already references the official Docker image. The GitHub server needs a PAT (the `docker` transport). When VS Code/opencode starts the container, set `GITHUB_PERSONAL_ACCESS_TOKEN` to your token. The config uses an input prompt so it is not hardcoded. You can also export it in the shell before launching the container:

```bash
export GITHUB_PERSONAL_ACCESS_TOKEN=github_pat_...
```

The remote (simpler, no token) option is the hosted server at `https://api.githubcopilot.com/mcp/` if your MCP host supports remote servers.

---

## PART H - Re-enable and run the workflows

The three workflows currently have `if: false` on their jobs. Re-enable them **after** the secrets in Part D are set.

### H1. Re-enable each workflow

Edit each file and remove the `if: false` line from the job, e.g.:

```yaml
jobs:
  changes:
    runs-on: ubuntu-latest   # <- previously had `if: false # disabled`
```

Files:
- `.github/workflows/ci.yml` → remove `if: false` on the `changes` job (and dependent jobs reference it; they inherit the disable only through the `changes` output, so removing it on `changes` is enough; dependent jobs may keep their own conditions).
- `.github/workflows/deploy-cloudflare.yml` → remove `if: false` on the `deploy` job.
- `.github/workflows/sync-generated-output.yml` → remove `if: false` on the `sync` job.

### H2. Update to the correct action versions

Your `deploy-cloudflare.yml` uses `cloudflare/wrangler-action@v3`. As of 2026 the current major is **v4**. Update it:

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/wrangler-action@v4
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ vars.CLOUDFLARE_ACCOUNT_ID }}
    command: pages deploy build --project-name=zarishnoksha
```

(`accountId` from `vars` now that it's a variable, not a secret.)

### H3. Add the npm publish workflow

Create `.github/workflows/npm-publish.yml`. Two equivalent forms.

**With Trusted Publishing (OIDC, recommended) — no token secret needed:**

```yaml
name: Publish CLI to npm

on:
  push:
    tags:
      - "cli-v*"

permissions:
  contents: read
  id-token: write   # required for npm Trusted Publishing (OIDC)

concurrency:
  group: npm-publish
  cancel-in-progress: false

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: actions/setup-node@v6
        with:
          node-version: 24
          registry-url: "https://registry.npmjs.org"
          always-auth: true
      - name: Install dependencies
        run: bun install --frozen-lockfile
      - name: Build
        run: bun run build
      - name: Test
        run: bun run test:core
      - name: Publish to npm
        run: |
          bun run prepack
          npm publish --provenance
          bun run postpack
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }} # ignored for OIDC trusted publishing; keep for fallback
```

> When Trusted Publishing is configured, `NODE_AUTH_TOKEN` is not required. To keep the workflow tokenless, you can omit the `NODE_AUTH_TOKEN` line entirely. The `--provenance` flag generates a supply-chain attestation automatically for public packages.

**With a Granular Access Token fallback:** define the secret `NPM_TOKEN` (Part C Option 2) and keep the `NODE_AUTH_TOKEN` line.

### H4. Commit, push, and trigger

```bash
cd ~/zarishnoksha
git add -A
git commit -m "Configure CI/CD: secrets, workflows, dependabot, branch protection"
git push origin main
```

- On push to `main`, `ci.yml` runs. On merge to `main`, `deploy-cloudflare.yml` deploys the site.
- `sync-generated-output.yml` runs when source paths change and (with the PAT) automatically pushes the regenerated harness folders.
- To publish the CLI: create + push a tag `cli-v1.0.0`:
  ```bash
  git tag cli-v1.0.0
  git push origin cli-v1.0.0
  ```

---

## 11. Workflow reference

### `.github/workflows/ci.yml` (summary)

- `on: push [main]`, `pull_request [main]`, `workflow_dispatch`.
- `changes` job computes a test plan via `scripts/ci-test-plan.mjs`.
- `test` job: lint, core tests, detector tests (Puppeteer), live tests, framework tests, build, build extension, verify generated tracked outputs via `git diff --exit-code`, upload `dist`.
- `cli-remote-e2e`, `live-e2e-smoke`, `live-e2e-full`, `live-e2e-accept-cleanup`, `live-svelte-adapter-deepseek`, `skill-behavior` jobs run conditionally on the plan and only when provider keys are configured (they skip cleanly otherwise).
- Provider-backed jobs use repo secrets `ANTHROPIC_API_KEY`, `OPENAI_API_KEY`, `GOOGLE_CLOUD_API_KEY`, `DEEPSEEK_API_KEY` (these are **your own LLM API keys**, optional; add them as secrets only if you want those suites to run in CI).

### `.github/workflows/deploy-cloudflare.yml` (summary)

- `on: push [main]`, `workflow_dispatch`.
- Build site with `bun run build`, deploy `build/` to Pages project `zarishnoksha` via `wrangler-action@v4`.
- Uses `CLOUDFLARE_API_TOKEN` (secret) + `CLOUDFLARE_ACCOUNT_ID`, `CLOUDFLARE_PROJECT_NAME` (variables).

### `.github/workflows/sync-generated-output.yml` (summary)

- `on: push` to `main` when `skill/**`, `scripts/**`, `cli/engine/**`, `.claude-plugin/**`, `package.json`, `bun.lock` change; plus `workflow_dispatch`.
- Runs `bun run build:release`, checks `git status --porcelain` on the generated harness dirs, commits + pushes if drifted.
- Uses `SYNC_GENERATED_OUTPUT_TOKEN` to ensure follow-up workflows trigger.

---

## 12. Secrets quick-reference table

| Secret / Variable | Name in GitHub | Type | Where created | Required for |
|---|---|---|---|---|
| Cloudflare API token | `CLOUDFLARE_API_TOKEN` | secret | Cloudflare API tokens | deploy-cloudflare |
| Cloudflare account ID | `CLOUDFLARE_ACCOUNT_ID` | variable | Cloudflare dashboard | deploy-cloudflare |
| Cloudflare project name | `CLOUDFLARE_PROJECT_NAME` | variable | Cloudflare Pages | deploy-cloudflare |
| GitHub fine-grained PAT | `SYNC_GENERATED_OUTPUT_TOKEN` | secret | GitHub PATs | sync-generated-output |
| npm token (only if Option 2) | `NPM_TOKEN` | secret | npm tokens | npm-publish |
| npm trusted publisher | (config on npmjs.com) | config | npm package settings | npm-publish (OIDC) |

---

## 13. Troubleshooting

**Workflows don't appear / are skipped.**
- Confirm every job's `if: false` is removed.
- Confirm the workflow files are on `main` (workflows only run from `main`/default branch).
- Check the repo has Actions enabled: `Settings → Actions → General → Allow all actions`.

**Cloudflare deploy fails with 401/403.**
- `CLOUDFLARE_API_TOKEN` missing or wrong → re-run Part B2 and re-add the secret.
- Token lacks Pages-Edit permission → re-scope the token.

**npm publish fails with 403 while trusted publishing is configured.**
- Remove the `NODE_AUTH_TOKEN` / `always-auth` / `registry-url` lines in the publish job (they force token auth).
- Ensure the workflow-name field on npmjs.com exactly matches `npm-publish.yml`.

**sync-generated-output doesn't push.**
- Use `SYNC_GENERATED_OUTPUT_TOKEN` (default GITHUB_TOKEN suppresses follow-ups).
- Ensure the PAT has Contents read+write on this repo.

**Puppeteer/browser tests hang in GitHub Actions.**
- The `test` job installs Puppeteer Chrome via `bunx puppeteer browsers install chrome`; confirm that runs. If flakes, run those offline-local instead.

**A pushed tag doesn't publish.**
- Tags trigger only `npm-publish.yml` on `cli-v*`. Confirm the tag name matches the pattern and the file is on `main`.

---

Ready to go: complete Parts A-F, re-enable the workflows, push, and watch the pipeline run from the GitHub Actions tab (the command centre).
