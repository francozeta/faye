# Eve Demo UI Design

## Goal

Build the first demo-ready FAYE interface: a polished, minimal product screen where Eve visibly classifies a household residue, explains the next action, and records progress without relying on live AI yet.

## Product Positioning

FAYE is an environmental AI companion for household recycling habits. Eve is the intelligent decision layer inside the experience, not a standalone chatbot surface. The UI should show Eve acting through structured guidance: identification, confidence, disposal category, preparation step, habit reward, and impact.

## Primary Screen

The first screen is the product itself. It contains:

- A compact header with the FAYE logo, demo status, and release-stage context.
- An input panel for camera/upload intent and seeded demo residues.
- A central Eve decision panel that shows the analysis state and final recommendation.
- A habit and impact panel that updates when the user records the action.

The judge should understand the loop in under 20 seconds.

## Interaction Model

The MVP uses seeded residues for reliability:

- Plastic PET bottle.
- Paper receipt.
- Organic food waste.

Selecting an item changes the scenario. The "Analyze with Eve" action briefly enters an analyzing state. The result then shows Eve's classification and recommended action. The "Record action" action marks the habit as completed and updates progress metrics.

## Visual Direction

Use a Vercel/Linear-inspired product interface:

- Neutral dark surface.
- Thin borders.
- Compact typography.
- Clear hierarchy.
- Muted color accents for confidence, impact, and action.
- No landing-page hero and no generic chat transcript.

## Architecture

`app/page.tsx` stays a Server Component and renders static shell content plus a client island. `components/faye-demo.tsx` owns the demo interactivity. `lib/demo-residues.ts` stores seeded scenarios as plain typed data. `components/faye-logo.tsx` renders the provided mark with stable SVG IDs.

## Error and Fallback Behavior

No external API is required in this phase. The UI communicates demo confidence honestly. Tomorrow's AI layer can call AI Gateway from a server route and keep the seeded scenarios as fallback.

## Verification

Run:

- `pnpm check:quick`
- `pnpm build`

Visually verify the local app at `http://localhost:3000/`.
