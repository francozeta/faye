# FAYE

FAYE is an environmental AI app for Hackathon QuipuSoft 2026. Its purpose is to help people build real household waste classification and recycling habits.

The product is not a generic recycling chatbot. FAYE is the visible product: it identifies a residue, explains the correct action, helps the user act, records the habit, and makes progress visible. Eve is the invisible internal AI layer that will power classification, recommendations, memory, and tone when the live AI layer is connected.

## Demo Thesis

FAYE turns uncertainty into action, then turns repeated action into a measurable habit.

Primary loop:

1. Capture or upload a residue.
2. FAYE identifies it with confidence and context.
3. FAYE explains how to classify and prepare it.
4. The user records the completed action.
5. FAYE updates habit progress and impact.

## Stack

- Next.js 16 App Router.
- React 19.
- Tailwind CSS 4.
- shadcn/base-ui components.
- Supabase for persistence when it strengthens the demo.
- Vercel AI Gateway through `AI_GATEWAY_API_KEY` when the AI layer is added.

## Local Development

Run the development server:

```bash
corepack pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

Useful checks:

```bash
corepack pnpm check:quick
corepack pnpm check
```

## Workflow

- Use focused branches such as `feat/faye-demo-ui`, `fix/ci-build`, or `docs/product-context`.
- Keep commits conventional, for example `feat: add faye demo ui`.
- Open pull requests for meaningful product or automation changes.
- Release automation is handled by Release Please after conventional commits land on `main`.

## Current Phase

Phase 1 is focused on the polished demo experience:

- A clear first screen.
- A visible FAYE decision loop.
- Demo-safe residue scenarios.
- Progress and impact feedback.
- No chatbot-first interface.

## Product Docs

- `docs/product-context.md`
- `docs/hackathon-context.md`
- `docs/implementation-phases.md`
- `docs/development-workflow.md`
