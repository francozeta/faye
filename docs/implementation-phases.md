# FAYE Implementation Phases

## Phase 0: Repo Foundation

Goal: make work repeatable and safe before major product changes.

Deliverables:

- Product context captured in docs.
- Development workflow captured in docs.
- GitHub Actions verification.
- PR template.
- Release Please config.
- Husky pre-commit and pre-push hooks.

Exit criteria:

- `pnpm check` passes locally.
- CI can run the same command.
- Branch and commit conventions are explicit.

## Phase 1: Demo Experience

Goal: build one polished end-to-end loop.

Deliverables:

- First screen is the usable product, not a landing page.
- Camera/upload or demo image entry point.
- Eve result panel.
- Action instructions.
- Progress/impact update.
- Responsive, demo-ready UI.

Exit criteria:

- A judge can understand the product in under 20 seconds.
- The scan-to-progress loop works without backend dependency.

## Phase 2: AI Demo-Safe Layer

Goal: make Eve feel intelligent without risking the pitch.

Deliverables:

- Curated residue scenarios.
- Optional real AI endpoint for image/context analysis.
- Fallback if model, network, or key fails.
- Clear confidence and next-action language.

Exit criteria:

- Demo succeeds even without external API availability.
- AI use is still credible and visible.

## Phase 3: Supabase Persistence

Goal: persist only what makes the demo stronger.

Deliverables:

- Minimal tables for actions, habit events, or profile progress.
- RLS-safe policies if user data is persisted.
- Client/server helpers following Next.js boundaries.

Exit criteria:

- User progress survives refresh when configured.
- No sensitive keys are exposed client-side.

## Phase 4: Demo Polish

Goal: make FAYE feel like a real product.

Deliverables:

- Mobile-first layout polish.
- Stable copy for Eve.
- Pitch mode or seeded demo state.
- Screenshots and final QA checklist.

Exit criteria:

- `pnpm check` passes.
- Main demo path has been tested in browser.
- Known fallbacks are documented.
