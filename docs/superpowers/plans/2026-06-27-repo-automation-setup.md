# Repo Automation Setup Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Establish a lightweight professional repo workflow for FAYE before product feature development.

**Architecture:** Keep app code untouched. Add repo-level documentation, package scripts, GitHub automation, Release Please configuration, and Husky hooks that all run the same core verification command.

**Tech Stack:** Next.js 16, React 19, pnpm, GitHub Actions, Husky, Release Please.

---

### Task 1: Document Project Direction

**Files:**

- Create: `docs/product-context.md`
- Create: `docs/implementation-phases.md`
- Create: `docs/development-workflow.md`

- [x] **Step 1: Capture product context**

Write the hackathon goal, FAYE positioning, internal AI layer, MVP demo loop, rubric criteria, and non-goals in `docs/product-context.md`.

- [x] **Step 2: Capture phases**

Write Phase 0 through Phase 4 in `docs/implementation-phases.md`, with deliverables and exit criteria.

- [x] **Step 3: Capture workflow**

Write branch, commit, PR, verification, and release rules in `docs/development-workflow.md`.

### Task 2: Add Package Verification Scripts

**Files:**

- Modify: `package.json`
- Modify: `pnpm-lock.yaml`

- [x] **Step 1: Add scripts**

Add `typecheck`, `check:quick`, `check`, and `prepare` scripts to `package.json`.

- [x] **Step 2: Add Husky dependency**

Add `husky` as a dev dependency and update `pnpm-lock.yaml` with `pnpm install --lockfile-only`.

### Task 3: Add GitHub Automation

**Files:**

- Create: `.github/workflows/verify.yml`
- Create: `.github/workflows/release-please.yml`
- Create: `.github/workflows/labeler.yml`
- Create: `.github/PULL_REQUEST_TEMPLATE.md`
- Create: `.github/dependabot.yml`
- Create: `.github/labeler.yml`

- [x] **Step 1: Add Verify workflow**

Install pnpm dependencies, run `pnpm check`, and run `git diff --check`.

- [x] **Step 2: Add Release Please workflow**

Use `release-please-config.json` and `.release-please-manifest.json`.

- [x] **Step 3: Add PR labeling**

Label PRs by changed paths and branch prefixes.

- [x] **Step 4: Add Dependabot**

Group package and GitHub Actions updates weekly.

### Task 4: Add Local Hooks

**Files:**

- Create: `.husky/pre-commit`
- Create: `.husky/pre-push`
- Create: `.husky/commit-msg`

- [x] **Step 1: Add quick checks before commit**

Run `pnpm check:quick` and staged whitespace checks.

- [x] **Step 2: Add full checks before push**

Run `pnpm check`.

- [x] **Step 3: Enforce conventional commit shape**

Validate commit messages against the accepted prefixes.

### Task 5: Verify

**Files:**

- No new files.

- [x] **Step 1: Install lockfile-only**

Run `pnpm install --lockfile-only` with the local pnpm executable.

- [x] **Step 2: Configure hooks locally**

Run `git config core.hooksPath .husky`.

- [x] **Step 3: Run verification**

Run `pnpm check:quick`. If it passes, run `pnpm check`.
