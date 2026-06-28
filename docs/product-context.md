# FAYE Product Context

## Hackathon

FAYE is being built for Hackathon QuipuSoft 2026:

> Agentes de IA para incentivar los habitos de clasificacion y reciclado domestico.

The strong demo date is June 30, 2026. The product priority is a small, reliable, memorable MVP, not a large platform.

## Product Thesis

FAYE is not just a trash classifier or a recycling chatbot. FAYE is an environmental AI app that helps people build real domestic classification and recycling habits.

The user problem is not only "what is this waste?" The real loop is:

1. Uncertainty: the user does not know what to do.
2. Understanding: the user needs a clear explanation.
3. Action: the user needs a concrete next step.
4. Recording: the action should count.
5. Motivation: the user should see progress.
6. Repetition: the habit should become easier next time.

## Eve / Internal AI Layer

FAYE is the product the user and jury see. Eve is the invisible internal agent layer that powers classification, recommendations, memory, and tone. Eve can have a personality in the system design, but the MVP interface should present the experience as FAYE acting clearly and reliably.

For the MVP, the AI layer should:

- Identify or infer the waste item from a photo or selected demo item.
- Explain the category and disposal action in simple language.
- Mention uncertainty honestly when the answer is not guaranteed.
- Register the action as progress.
- Reinforce the next habit with a small, motivating response.

## Evaluation Criteria

The official rubric gives 20 total points:

- Innovation and use of AI: 4 points.
- Impact: 4 points.
- Factibility: 4 points.
- Functionality: 4 points.
- Usability: 4 points.

FAYE should optimize for a complete visible loop that scores across all five criteria.

## MVP Demo Loop

The primary demo should be:

1. User opens FAYE.
2. User captures or uploads a photo of a residue.
3. FAYE identifies it or uses a safe demo fallback.
4. FAYE explains what it is, how to classify it, and what to do next.
5. FAYE records the action.
6. The UI updates habit progress, impact, streak, or reward.

The pitch should be able to say:

"FAYE turns uncertainty into an action and turns repeated actions into a habit."

## Non-Goals Before Demo

- A huge recycling encyclopedia.
- A perfect computer vision model.
- A generic chatbot surface.
- Complex infrastructure that does not visibly help the demo.
- Auth-heavy flows unless they unlock clear progress persistence.

## Technical Direction

Use the existing stack:

- Next.js 16 App Router.
- React 19.
- Tailwind CSS 4.
- shadcn/base-ui components already installed.
- Supabase for persistence when it directly supports demo value.

Prefer a demo-safe AI architecture:

- Real AI where it adds value.
- Guardrails and curated fallback scenarios where failure would break the pitch.
- Server-side secrets only.
- Client-side interactivity only where browser APIs or local state are needed.
