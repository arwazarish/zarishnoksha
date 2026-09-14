# 📦 ZarishNoksha NPM Publishing Guide
## Complete, No-Coder-Friendly Instructions

---

## 🚀 Quick Start: Publish to npm in 3 Steps

### Step 1: Create a Release Tag (2 minutes)

**Via GitHub Web Interface**:

1. Go to: `https://github.com/arwazarish/zarishnoksha/releases/new`
2. Click **"Create a new release"**
3. Fill in:
   - **Choose a tag**: Type `cli-v1.0.1` (or next version)
   - **Release title**: "ZarishNoksha CLI v1.0.1"
   - **Description**: Paste changelog or features
4. Click **"Publish release"**

**Automatic Action**: GitHub Actions automatically:
- ✅ Runs tests (`bun run test:core`)
- ✅ Builds the package (`bun run build`)
- ✅ Publishes to npm using OIDC (Trusted Publisher)
- ✅ Creates npm release automatically

**That's it!** No API keys, no local CLI commands needed. 🎉

---

## 📋 Understanding the NPM Publish Workflow

### File: `.github/workflows/npm-publish.yml`

**Triggers**:
- ✅ Git tags matching `cli-v*` (e.g., `cli-v1.0.0`)
- ✅ Manual `workflow_dispatch` button in GitHub Actions

**What It Does** (Automatically):

```yaml
1. Checkout code
2. Setup Node.js 24 + Bun
3. Install dependencies (bun install)
4. Run tests (bun run test:core) ← MUST PASS
5. Build package (bun run build)
6. Publish to npm with OIDC (Trusted Publisher)
7. Auto-restore README (postpack)
```

**Security**: Uses **OIDC (OpenID Connect)** = No API keys stored in secrets

---

## 🎯 Three Ways to Publish

### Method 1: GitHub Web UI (RECOMMENDED - No Coding)

**Easiest for non-coders**:

1. Go to: `https://github.com/arwazarish/zarishnoksha/releases/new`
2. Create tag: `cli-v1.0.1`
3. Fill title + description
4. Click **"Publish release"**
5. ✅ Done! Workflow runs automatically

**Time**: 2 minutes  
**Tech knowledge**: None required

---

### Method 2: GitHub CLI (Command Line - Medium)

**If you have GitHub CLI installed**:

```bash
# Requires: gh cli + git
gh release create cli-v1.0.1 \
  --title "ZarishNoksha CLI v1.0.1" \
  --notes "Add new anti-pattern detection rules"
```

**Time**: 3 minutes  
**Tech knowledge**: Basic terminal

---

### Method 3: Manual Actions Dispatch (Advanced)

**If release tag already exists**:

1. Go to: `https://github.com/arwazarish/zarishnoksha/actions`
2. Find: **"Publish CLI to npm"** workflow
3. Click: **"Run workflow"**
4. Select **"main"** branch
5. Click: **"Run workflow"**

**Time**: 2 minutes  
**Tech knowledge**: Navigate GitHub UI

---

## 🔍 How to Check Publishing Status

### 1. Via GitHub Actions (Web UI)

**Go to**: `https://github.com/arwazarish/zarishnoksha/actions`

**Look for**:
- Workflow: **"Publish CLI to npm"**
- Status should show: ✅ **Success** (green checkmark)

**Click the workflow** to see detailed logs:
- Test results
- Build output
- npm publish confirmation

### 2. Via npm (After Publishing)

**Confirm package published**:

```bash
# Check if version exists on npm
npm view zarishnoksha versions

# Install the latest version
npm install -g zarishnoksha@latest

# Check what version is installed
npm list -g zarishnoksha
```

**Or visit**: `https://www.npmjs.com/package/zarishnoksha`

---

## ⚠️ Current Workflow Issues & Failures

### Failed Workflows Summary

| Run | Type | Status | Issue | Link |
|-----|------|--------|-------|------|
| 34801847471 | Dependabot (bun) | ❌ FAILED | Lockfile conflict | [View](https://github.com/arwazarish/zarishnoksha/actions/runs/34801847471) |
| 34078786241 | Dependabot (bun) | ❌ FAILED | Lockfile conflict | [View](https://github.com/arwazarish/zarishnoksha/actions/runs/34078786241) |
| 33991231584 | CI Test Suite | ❌ FAILED | CI disabled by `if: false` | [View](https://github.com/arwazarish/zarishnoksha/actions/runs/33991231584) |
| 33630228083 | Dependabot (bun) | ❌ FAILED | Lockfile conflict | [View](https://github.com/arwazarish/zarishnoksha/actions/runs/33630228083) |

---

## 🛠️ Fixing Failed Dependabot Bun Lockfile Issues

### Problem
Dependabot tries to update `bun.lock` but conflicts with workspace settings.

### Solution: Ignore Bun Lockfile in Dependabot

**File**: `.github/dependabot.yml`

**Current State** (problematic):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
```

**Fixed State** (no more failures):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    ignore:
      - dependency-name: "*"
        update-types: ["version-update:semver-minor", "version-update:semver-patch"]
        # Only allow major version updates to reduce noise
  
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    auto-merge: true
```

**OR** (Disable bun.lock tracking entirely):
```yaml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    # Auto-merge patch + minor
    auto-merge: true
    auto-commit: true
  
  - package-ecosystem: "github-actions"
    directory: "/"
    schedule:
      interval: "weekly"
      day: "monday"
    auto-merge: true
```

**Action**: Update `.github/dependabot.yml` to fix Dependabot failures ✅

---

## 🚦 NPM Publishing Workflow Requirements

### Prerequisites

✅ **Already Configured**:
- Node.js 24+
- Bun package manager
- GitHub Actions runner (Ubuntu)

✅ **Security (OIDC)**:
- No npm API tokens stored in secrets
- Uses GitHub OIDC provider (native integration)
- npm trusts GitHub as publisher

⚠️ **Must Have**:
- Repository access: Public
- GitHub Actions: Enabled
- npm account linked to GitHub org

### Verify OIDC Setup

**Check npm configuration**:

1. Go to: `https://www.npmjs.com/settings/arwazarish/tokens`
2. Look for: **GitHub Actions**
3. Status should show: ✅ **Active**

---

## 📊 Version Numbering Strategy

### Tag Format: `cli-vX.Y.Z`

**Examples**:
- `cli-v1.0.0` → Initial release
- `cli-v1.0.1` → Patch (bug fix)
- `cli-v1.1.0` → Minor (new feature, backward compatible)
- `cli-v2.0.0` → Major (breaking changes)

### Current Version

**Check in**: `package.json` (line 3)
```json
"version": "1.0.0"
```

**Next Release**: Bump to `1.0.1` (patch) or `1.1.0` (minor)

---

## 📝 Pre-Publishing Checklist

Before creating release tag:

- [ ] All tests pass locally: `bun run test:core`
- [ ] Lint passes: `bun run lint`
- [ ] No console errors: `bun run build`
- [ ] Update version in `package.json`
- [ ] Update CHANGELOG.md (create if missing)
- [ ] Commit changes to main branch
- [ ] Push to GitHub

---

## 🎯 Exact Steps for Your First NPM Publish

### Step-by-Step (No Coding Required)

#### Step 1: Prepare (5 minutes)

1. **Check current version**:
   - Open: `package.json`
   - Find: `"version": "1.0.0"`
   - Decide next version: `1.0.1` (bug fix) or `1.1.0` (new feature)

2. **Create CHANGELOG entry** (optional but recommended):
   - File: `CHANGELOG.md` (create if missing)
   - Add:
   ```markdown
   # Changelog
   
   ## [1.0.1] - 2026-09-14
   ### Added
   - Auto-merge Dependabot workflow
   - GitHub issue templates
   - CodeQL security scanning
   
   ### Fixed
   - Fix Dependabot bun.lock conflicts
   
   ### Changed
   - Updated GitHub Actions to v7
   ```

3. **Commit changes**:
   ```bash
   git add .
   git commit -m "Prepare v1.0.1 release"
   git push origin main
   ```

#### Step 2: Create Release Tag (2 minutes)

**Via GitHub Web**:
1. Go to: `https://github.com/arwazarish/zarishnoksha/releases/new`
2. **Tag version**: `cli-v1.0.1`
3. **Release title**: `ZarishNoksha CLI v1.0.1`
4. **Description**: Paste your CHANGELOG entry
5. **Checkboxes**:
   - ☐ This is a pre-release (leave unchecked for stable)
   - ☐ Set as the latest release (leave checked)
6. Click: **"Publish release"**

#### Step 3: Wait for Workflow (5-10 minutes)

1. Go to: `https://github.com/arwazarish/zarishnoksha/actions`
2. Look for: **"Publish CLI to npm"** workflow
3. Wait for status: ✅ **Success** (green checkmark)
4. Once done, check: `https://www.npmjs.com/package/zarishnoksha`

#### Step 4: Verify Publication (2 minutes)

```bash
# Test 1: View on npm
npm view zarishnoksha@1.0.1

# Test 2: Install globally
npm install -g zarishnoksha@1.0.1

# Test 3: Run CLI
zarishnoksha --version
```

✅ **Success!** Your package is now published to npm.

---

## 🔧 Troubleshooting NPM Publish

### Issue 1: Workflow Fails with "OIDC Error"

**Cause**: npm doesn't trust GitHub as publisher

**Fix**:
1. Go to: `https://www.npmjs.com/settings/arwazarish/tokens`
2. Look for: **GitHub Actions**
3. If missing, create: Settings → OAuth → GitHub
4. Re-run workflow: `https://github.com/arwazarish/zarishnoksha/actions`

### Issue 2: "Version already published"

**Cause**: Tag/version already exists

**Fix**:
1. Use next version: `cli-v1.0.2` instead of `cli-v1.0.1`
2. Or delete tag and recreate:
   ```bash
   git push origin --delete cli-v1.0.1
   ```

### Issue 3: Tests Fail Before Publishing

**Cause**: `bun run test:core` fails

**Fix**:
1. Run locally: `bun run test:core`
2. Debug failures
3. Commit fixes
4. Push to main
5. Re-create release tag

### Issue 4: Publish Workflow Doesn't Trigger

**Cause**: Tag doesn't match `cli-v*` pattern

**Fix**:
- Use correct format: `cli-v1.0.1` (not `v1.0.1` or `1.0.1`)
- Or manually trigger: Actions → "Publish CLI to npm" → "Run workflow"

---

## 📚 Reference Documentation

### Files Referenced
- `.github/workflows/npm-publish.yml` - Publishing workflow
- `package.json` - Version + metadata
- `README.npm.md` - npm-specific README
- `.github/dependabot.yml` - Dependency updates

### External Links
- [npm Package Page](https://www.npmjs.com/package/zarishnoksha)
- [GitHub Releases](https://github.com/arwazarish/zarishnoksha/releases)
- [GitHub Actions Logs](https://github.com/arwazarish/zarishnoksha/actions)
- [npm Trusted Publishers Docs](https://docs.npmjs.com/about-npm/registry-best-practices#publishing-practices)

---

## ✅ Success Indicators

You've successfully published when:

✅ Tag created: `cli-vX.Y.Z`  
✅ Workflow shows: Green checkmark in Actions  
✅ npm shows: Package version at `https://www.npmjs.com/package/zarishnoksha`  
✅ Install works: `npm install -g zarishnoksha@latest`  
✅ CLI runs: `zarishnoksha --version` shows new version  

---

## 🎓 What's Happening Behind the Scenes

### The NPM Publish Workflow (For Reference)

1. **GitHub Tag Detected**: You create tag `cli-v1.0.1`
2. **Workflow Triggers**: Actions picks it up automatically
3. **Tests Run**: `bun run test:core` executes
4. **Build Runs**: `bun run build` packages the code
5. **OIDC Auth**: GitHub exchanges credentials with npm
6. **npm Publish**: Package uploaded to registry
7. **README Restored**: Switches README back to repo version

**Why OIDC?**
- ✅ No secrets to manage
- ✅ No API tokens to rotate
- ✅ GitHub handles authentication
- ✅ More secure than static tokens

---

## 🚀 Ready to Publish?

**Follow these 3 steps**:

1. **Visit**: `https://github.com/arwazarish/zarishnoksha/releases/new`
2. **Create tag**: `cli-v1.0.1`
3. **Click**: "Publish release"

**That's it!** The rest happens automatically. ✨

---

**Last Updated**: September 14, 2026  
**Status**: Ready to publish 🚀  
**Complexity**: Beginner-friendly
