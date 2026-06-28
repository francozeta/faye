# Development Workflow

## Branches

Use conventional branch prefixes:

- `feat/...` for product features.
- `fix/...` for bug fixes.
- `docs/...` for documentation-only work.
- `chore/...` for repo maintenance, dependencies, CI, and setup.
- `refactor/...` for internal code changes without intended behavior changes.
- `test/...` for test-only work.

Current setup work lives on `chore/repo-automation-setup`.

## Commits

Use Conventional Commits:

- `feat(web): add waste scan flow`
- `fix(web): keep progress card stable on mobile`
- `docs: capture hackathon product context`
- `chore(ci): add verification workflow`

Release Please uses these commit types to draft releases and changelog entries.

## Pull Requests

Most meaningful work should go through a branch and PR:

1. Create a focused branch.
2. Keep commits small and reviewable.
3. Run `pnpm check` before requesting review.
4. Attach screenshots or a short recording for UI changes.
5. Merge only when CI passes and the demo path still works.

For hackathon speed, tiny local-only documentation or config fixes may be committed directly when they are low risk, but product behavior should use PRs.

## Verification

Local commands:

- `pnpm check:quick`: lint and TypeScript.
- `pnpm check`: lint, TypeScript, and production build.

Hooks:

- Pre-commit runs `pnpm check:quick` and staged whitespace checks.
- Pre-push runs `pnpm check`.

CI:

- `Verify` runs on pushes to `main`, pull requests, and manual dispatch.
- CI installs dependencies from `pnpm-lock.yaml`, runs `pnpm check`, and checks whitespace.
- `Sync Labels` keeps GitHub labels aligned with `.github/labels.json`.
- `Labeler` applies area/type labels to pull requests once the workflow exists on `main`.

## Release Automation

Release Please is configured to:

- Draft release PRs from Conventional Commits.
- Maintain `CHANGELOG.md`.
- Tag versions as `vX.Y.Z`.

Before the June 30 demo, releases are useful as milestones:

- `v0.1.0`: repo baseline and demo direction.
- `v0.2.0`: primary demo loop.
- `v0.3.0`: AI and persistence polish.
- `v1.0.0-demo`: final demo candidate, only if the app is stable.
