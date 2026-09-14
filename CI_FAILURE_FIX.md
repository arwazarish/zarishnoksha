# 🔴 CI Test Failure Analysis & Fix
## Build Generated Files Mismatch Issue

---

## 📊 Current Status

**Latest CI Run**: #34856921738 (September 14, 2026)  
**Status**: ❌ **FAILED**  
**Failure Type**: Generated file mismatch  
**Affected Tests**: Build verification step

---

## 🐛 The Problem

### What Went Wrong

The CI workflow detected that **generated files are out of sync** with the source code.

**Test Command**: `git diff --exit-code`

**What It Checks**:
```bash
# The CI runs this after building:
git diff --exit-code -- .agents .claude .cursor .gemini .github/skills plugin cli/engine/detect-antipatterns-browser.js extension/detector
```

**Why It Failed**:
When you run `bun run build` on the GitHub Actions runner, it generates these files differently than they were committed. This means:

1. ❌ The **generated files were NOT rebuilt** after your recent code changes
2. ❌ The **skill definitions are stale** (outdated versions)
3. ❌ The **browser detector is outdated** (needs rebuilding)

---

## 🔍 Root Cause

### The Files That Need Rebuilding

| Directory | Purpose | Status |
|-----------|---------|--------|
| `.agents/` | Codex CLI skills | ❌ Out of sync |
| `.claude/` | Claude Code skills | ❌ Out of sync |
| `.cursor/` | Cursor IDE skills | ❌ Out of sync |
| `.gemini/` | Gemini CLI skills | ❌ Out of sync |
| `.github/skills/` | GitHub Copilot skills | ❌ Out of sync |
| `plugin/` | IDE plugin files | ❌ Out of sync |
| `cli/engine/detect-antipatterns-browser.js` | Browser detector bundle | ❌ Out of sync |
| `extension/detector/` | Firefox extension | ❌ Out of sync |

### Why This Happens

These files are **generated artifacts** from:
- `skill/` directory (source definitions)
- `cli/` directory (detector engine)
- Build scripts in `scripts/`

**When you commit code changes**, you must also **rebuild and commit the generated files**.

---

## ✅ The Fix (Local Development)

### Step 1: Rebuild Generated Files

**In your terminal**:

```bash
# Navigate to project root
cd /path/to/zarishnoksha

# Rebuild all generated files
bun run build

# OR for release build
bun run build:release
```

**What This Does**:
- Rebuilds all skills from `skill/` → `.agents/`, `.claude/`, `.cursor/`, etc.
- Regenerates browser detector: `cli/engine/detect-antipatterns-browser.js`
- Regenerates extension: `extension/detector/`
- Builds the site

### Step 2: Verify Changes

```bash
# Check what files changed
git status

# Should show changes in:
# - .agents/
# - .claude/
# - .cursor/
# - .gemini/
# - .github/skills/
# - plugin/
# - cli/engine/detect-antipatterns-browser.js
# - extension/detector/
# - build/
# - dist/
```

### Step 3: Commit Changes

```bash
# Stage the generated files
git add .agents/ .claude/ .cursor/ .gemini/ .github/skills/ plugin/ cli/engine/detect-antipatterns-browser.js extension/detector/

# Commit
git commit -m "Rebuild generated skill files and browser detector"

# Push
git push origin main
```

### Step 4: Verify CI Passes

1. Go to: `https://github.com/arwazarish/zarishnoksha/actions`
2. Look for: **"CI"** workflow
3. Check status: Should show ✅ **Success**

---

## 🚀 Quick Fix Commands (Copy & Paste)

**All in one**:

```bash
cd ~/zarishnoksha
bun run build
git add .agents/ .claude/ .cursor/ .gemini/ .github/skills/ plugin/ cli/engine/detect-antipatterns-browser.js extension/detector/
git commit -m "Rebuild generated skill files and browser detector"
git push origin main
```

---

## 📋 What Each Generated File Is For

### 1. `.agents/` (Codex CLI Skills)

**Purpose**: Agent skills for Codex CLI  
**Rebuilt From**: `skill/` definitions  
**When To Rebuild**: After any changes to skills

```bash
bun run build:skills
```

### 2. `.claude/`, `.cursor/`, `.gemini/`, etc.

**Purpose**: Skills for each AI tool (Claude, Cursor, Gemini, etc.)  
**Rebuilt From**: `skill/` definitions  
**When To Rebuild**: After any changes to skills

### 3. `cli/engine/detect-antipatterns-browser.js`

**Purpose**: Browser-ready detector bundle  
**Rebuilt From**: `cli/engine/detect-antipatterns.mjs`  
**When To Rebuild**: After changes to detector logic

```bash
bun run build:browser
```

### 4. `extension/detector/`

**Purpose**: Firefox browser extension  
**Rebuilt From**: Source detector files  
**When To Rebuild**: After detector changes

```bash
bun run build:extension
```

---

## 🔄 Full Build Process

### Command: `bun run build`

Runs in this order:

```
1. bun run build:skills
   ↓ Regenerates: .agents/, .claude/, .cursor/, .gemini/, .github/skills/, plugin/
   
2. bun run build:site
   ↓ Regenerates: build/ (Astro site)
   
3. cp -R dist build/_data/dist
   ↓ Copies dist into build
```

### Command: `bun run build:release`

Same as above but uses release-optimized skill definitions.

---

## 🛠️ Advanced: Manual Skill Rebuilds

If you only changed specific skills:

```bash
# Rebuild only skills (no site)
bun run build:skills

# Then commit only skill files
git add .agents/ .claude/ .cursor/ .gemini/ .github/skills/ plugin/
git commit -m "Update skill definitions"
```

---

## 📝 Checklist Before Pushing Code

- [ ] Made code changes to `skill/` or `cli/` directories
- [ ] Ran `bun run build` locally
- [ ] Verified files changed in `.agents/`, `.claude/`, etc.
- [ ] Committed generated files along with source changes
- [ ] Ran `git diff --exit-code` to verify nothing is uncommitted
- [ ] Pushed to GitHub
- [ ] Monitored CI to verify ✅ passes

---

## 🤔 Why Are Generated Files Committed?

**Good Question!** This is intentional:

✅ **Why It's Good**:
- Users can install skills directly from this repo
- No build step needed on installation
- Faster, more reliable skill distribution
- Can pin exact skill versions with git tags

❌ **Why It's Annoying**:
- Easy to forget to rebuild
- Merge conflicts in generated files
- More files to track

**Solution**: Always run `bun run build` before committing skill changes.

---

## 🚦 Test Results Breakdown

### Tests That Passed (✅)

- Deploy to Cloudflare Pages: ✅ Success
- Changes detection: ✅ Detected
- Setup steps: ✅ Installed

### Tests That Failed (❌)

- Verify generated tracked outputs: ❌ **Files out of sync**
  - `.agents/`
  - `.claude/`
  - `.cursor/`
  - `.gemini/`
  - `.github/skills/`
  - `plugin/`
  - `cli/engine/detect-antipatterns-browser.js`
  - `extension/detector/`

### Tests That Skipped (⏭️)

- CLI E2E tests: ⏭️ Skipped (no changes detected)
- Live E2E tests: ⏭️ Skipped (no changes detected)
- Skill behavior tests: ⏭️ Skipped (PR context)

---

## 🔐 How CI Verifies This

**File**: `.github/workflows/ci.yml` (Line 105-106)

```yaml
- name: Verify generated tracked outputs
  run: git diff --exit-code -- .agents .claude .cursor .gemini .github/skills plugin cli/engine/detect-antipatterns-browser.js extension/detector
```

**What It Does**:
1. Runs the build
2. Checks if any files changed
3. If files changed: ❌ FAIL (something wasn't committed)
4. If no changes: ✅ PASS (everything is in sync)

---

## 📚 Additional Resources

### Build Scripts

**File**: `package.json` (Lines 43-50)

```json
"build:skills": "bun run scripts/build.js --skip-root-sync",
"build:skills:release": "bun run scripts/build.js",
"build:site": "npx astro build",
"build": "bun run build:skills && bun run build:site && cp -R dist build/_data/dist",
"build:release": "bun run build:skills:release && bun run build:site && cp -R dist build/_data/dist",
"build:browser": "node scripts/build-browser-detector.js",
"build:extension": "node scripts/build-extension.js"
```

### Ignored Files in Git

**File**: `.gitignore`

These are NOT committed (local only):
```
/dist/
/build/
/node_modules/
```

But these ARE committed (shipped with repo):
```
/.agents/
/.claude/
/.cursor/
/.gemini/
/.github/skills/
/plugin/
/cli/engine/detect-antipatterns-browser.js
/extension/detector/
```

---

## ✅ Success Indicator

You've fixed it when:

✅ `git diff --exit-code` shows no changes  
✅ Committed generated files to git  
✅ CI workflow shows 🟢 **Success**  
✅ All job steps completed without "Verify generated tracked outputs" failure  

---

## 🆘 If You're Still Stuck

**Try this diagnostic**:

```bash
# Check what's different
git diff .agents/ .claude/ .cursor/ .gemini/ .github/skills/ plugin/ cli/engine/detect-antipatterns-browser.js extension/detector/ | head -50

# Reset local changes (if confused)
git checkout -- .

# Clean slate
rm -rf .agents .claude .cursor .gemini .github/skills plugin cli/engine/detect-antipatterns-browser.js extension/detector/

# Full rebuild
bun install
bun run build

# Check status
git status
```

---

**Status**: 🔴 Needs immediate fix  
**Estimated Time**: 5 minutes  
**Difficulty**: Easy (just rebuild)  
**Next**: Run `bun run build` and commit!
