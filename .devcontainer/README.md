# Dev Container Setup

## Quick Start

### Option A: With Podman (Recommended — rootless, no Docker daemon)

1. Install Podman:
   ```bash
   sudo apt install podman podman-compose
   ```

2. Install VS Code extension: `devcontainers.feature.dev-containers`

3. Open this project in VS Code → Command Palette → `Dev Containers: Reopen in Container`

VS Code will automatically detect Podman instead of Docker.

### Option B: With Docker

1. Install Docker Engine or Docker Desktop

2. Open this project in VS Code → Command Palette → `Dev Containers: Reopen in Container`

## What's Installed Inside the Container

| Tool | Version | Purpose |
|---|---|---|
| Node.js | 24 | Runtime |
| Bun | latest | Package manager, test runner |
| Git | latest | Version control |
| GitHub CLI | latest | PR/issue management |
| Playwright | latest | Browser E2E tests |
| Puppeteer | latest | Browser E2E tests |
| Zsh + Oh My Zsh | latest | Shell with autosuggestions |
| Biome | latest | Linter/formatter |

## VS Code Extensions (auto-installed)

| Extension | Purpose |
|---|---|
| Biome | Linting & formatting |
| Astro | Astro language support |
| Tailwind CSS IntelliSense | Tailwind autocomplete |
| GitLens | Git blame, history, diff |
| GitHub Actions | Workflow syntax |
| GitHub Pull Requests | PR review in VS Code |
| Error Lens | Inline error display |
| Todo Tree | Find TODO/FIXME/HACK |
| Path Intellisense | File path autocomplete |
| Playwright | Test runner integration |
| Code Spell Checker | Typo detection |
| Auto Rename Tag | HTML tag renaming |
| Color Highlight | CSS color preview |
| HTML CSS Class Intellisense | Class name autocomplete |
| dotenv | .env file syntax |
| YAML | YAML language support |
| TOML | TOML language support |
| TypeScript Nightly | Latest TS features |

## MCP Servers (AI Assistant Integration)

| Server | Purpose |
|---|---|
| GitHub MCP | Repository, PR, issue operations |
| Filesystem MCP | File read/write/search |
| Playwright MCP | Browser automation |
| Memory MCP | Persistent knowledge base |
| Fetch MCP | HTTP requests |

Configure `github-token` in `.vscode/mcp.json` with your GitHub PAT.

## Ports

| Port | Service |
|---|---|
| 4321 | Astro dev server (auto-opens in browser) |

## Troubleshooting

### Container fails to build
- Ensure Podman (or Docker) is running: `podman info` or `docker info`
- Check available disk space (container needs ~2 GB)

### Playwright/Puppeteer tests fail
- The container pre-installs Chromium. If missing:
  ```bash
  npx playwright install --with-deps chromium
  npx puppeteer browsers install chrome
  ```

### Bun install fails
- Lockfile might be stale. Try:
  ```bash
  rm bun.lock && bun install
  ```
