#!/usr/bin/env bash
set -euo pipefail

echo "=========================================="
echo "  ZarishNoksha Dev Container Setup"
echo "=========================================="

# Ensure we're in the workspace root
cd /workspaces/zarishnoksha 2>/dev/null || cd /home/vscode/zarishnoksha 2>/dev/null || true

# --- Bun ---
echo ""
echo ">> Installing Bun dependencies..."
if [ -f bun.lock ]; then
  bun install --frozen-lockfile
else
  bun install
fi

# --- Git config ---
echo ""
echo ">> Setting up Git config..."
git config --global core.autocrlf input
git config --global init.defaultBranch main
git config --global pull.rebase true
git config --global fetch.prune true
git config --global diff.colorMoved zebra

# --- Verify tools ---
echo ""
echo ">> Verifying installed tools..."

check() {
  if command -v "$1" &> /dev/null; then
    echo "  ✓ $1 $(command $1 --version 2>/dev/null | head -1)"
  else
    echo "  ✗ $1 NOT FOUND"
  fi
}

check node
check npm
check bun
check git
check gh
check playwright

# --- Build browser detector ---
echo ""
echo ">> Building browser detector bundle..."
bun run build:browser 2>/dev/null || echo "  (skipped — build:browser not critical for setup)"

echo ""
echo "=========================================="
echo "  Setup complete!"
echo "=========================================="
echo ""
echo "Quick start:"
echo "  bun run dev          # Start Astro dev server (port 4321)"
echo "  bun run build        # Full build"
echo "  bun run lint         # Lint with Biome"
echo "  bun run test:core    # Run core tests"
echo "  bun run test:detector # Run detector tests"
echo ""
