# FAYE Demo UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the default Next.js screen with a polished FAYE demo interface where FAYE guides classification, action, and progress. Eve remains the invisible internal AI layer.

**Architecture:** Keep the route shell as a Server Component and isolate interactivity in one client component. Store demo residue scenarios in a typed library module so the future AI route can reuse the same response contract as fallback data.

**Tech Stack:** Next.js 16 App Router, React 19, Tailwind CSS 4, shadcn/base-ui components, Hugeicons, TypeScript.

---

### Task 1: Documentation Baseline

**Files:**
- Delete: `.readme.md`
- Create: `docs/hackathon-context.md`
- Create: `docs/superpowers/specs/2026-06-27-eve-demo-ui-design.md`
- Create: `docs/superpowers/plans/2026-06-27-eve-demo-ui.md`
- Modify: `README.md`

- [ ] **Step 1: Move hackathon context into docs**

Create `docs/hackathon-context.md` with the theme, problem loop, challenge areas, evaluation criteria, and demo implication.

- [ ] **Step 2: Replace scaffold README**

Replace the Create Next App README with FAYE product, stack, scripts, branch workflow, and demo priorities.

- [ ] **Step 3: Remove the temporary rubric file**

Delete `.readme.md` after its useful content is reflected in the docs.

### Task 2: Design Tokens and Metadata

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/globals.css`

- [ ] **Step 1: Set app metadata**

Set title to `FAYE` and description to `Environmental AI companion for domestic recycling habits`.

- [ ] **Step 2: Fix font tokens**

Use literal Geist font names inside `@theme inline` so Tailwind v4 does not resolve `--font-sans` recursively.

- [ ] **Step 3: Apply dark product shell**

Default the root document to Spanish and dark product mode.

### Task 3: Demo Data Contract

**Files:**
- Create: `lib/demo-residues.ts`

- [ ] **Step 1: Define the scenario type**

Define `DemoResidue` with id, name, category, confidence, bin, preparation, rationale, habit, impact, and reward fields.

- [ ] **Step 2: Add three reliable scenarios**

Add PET bottle, paper receipt, and organic waste scenarios for the UI and future AI fallback.

### Task 4: Brand Mark

**Files:**
- Create: `components/faye-logo.tsx`

- [ ] **Step 1: Convert the supplied SVG**

Create a reusable `FayeLogo` component using the supplied cube mark with stable gradient IDs.

- [ ] **Step 2: Keep it presentation-only**

Use `aria-hidden` by default and let nearby text carry the brand name.

### Task 5: FAYE Demo Interface

**Files:**
- Create: `components/faye-flow.tsx`
- Create: `components/faye-demo.tsx`
- Modify: `app/page.tsx`
- Create: `app/scan/page.tsx`
- Create: `app/result/page.tsx`
- Create: `app/habit/page.tsx`
- Create: `app/demo/page.tsx`

- [x] **Step 1: Build the static shell**

Create a product workspace: input, FAYE decision, and habit impact.

- [x] **Step 2: Add scenario selection**

Use `ToggleGroup` with one active seeded residue.

- [x] **Step 3: Add analysis and logging states**

Use local React state for idle, analyzing, ready, and logged states. The analyzing state should resolve quickly and reliably.

- [x] **Step 4: Show FAYE as structured intelligence**

Render confidence, category, bin, preparation, rationale, and habit reward as a decision panel, not as a chat transcript.

- [x] **Step 5: Update progress metrics**

When the action is recorded, update streak/progress/impact in the UI.

- [x] **Step 6: Split demo into routes**

Use `/scan`, `/result`, `/habit`, and `/demo` so the presentation can be shown as a complete product flow or as one consolidated demo board.

### Task 6: Verification

**Files:**
- No source changes expected.

- [ ] **Step 1: Run static checks**

Run `pnpm check:quick`. Expected result: lint and typecheck pass.

- [ ] **Step 2: Run production build**

Run `pnpm build`. Expected result: Next.js build succeeds.

- [ ] **Step 3: Browser smoke test**

Open `http://localhost:3000/` and verify the screen renders, the scenario selector works, analysis transitions to a result, and record action updates progress.
