# Eve AI Adapter

FAYE is the app. Eve is the invisible AI layer that helps the product classify a
residue, explain the next action, and convert it into habit progress.

## Current slice

- `agent/` holds the durable Eve source of truth.
- `/api/eve/classify` is the product-facing adapter used by the UI.
- `FAYE_AI_PROVIDER` controls provider preference: `auto`, `google`,
  `openai`, or `gateway`. The default is `auto`.
- `GOOGLE_GENERATIVE_AI_API_KEY` enables direct Gemini calls through
  `@ai-sdk/google`. This avoids Vercel AI Gateway free-tier limits.
- `OPENAI_API_KEY` enables direct OpenAI calls through `@ai-sdk/openai`. This is
  an OpenAI Platform API key, not a ChatGPT subscription login.
- `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` enables Vercel AI Gateway.
- `FAYE_AI_MODEL` overrides the Gateway model only (`openai/gpt-5.4-mini` by
  default). It must be a model id like `openai/gpt-5.4-mini`, never an API key.
- `FAYE_GOOGLE_MODEL` overrides the direct Gemini model (`gemini-2.5-flash` by
  default).
- `FAYE_OPENAI_MODEL` overrides the direct OpenAI model (`gpt-4.1-mini` by
  default).
- If all configured providers fail, FAYE returns a deterministic local answer for
  demo inputs and a conservative `needs_input` response for image inputs.
- If there is no image or demo input, Eve returns `needs_input` instead of
  inventing a residue.

## Demo contract

The adapter returns the same shape used by the UI:

- residue identity
- normalized `residueTypeId` when the decision matches the waste catalog
- category and destination
- confidence
- recommended preparation
- impact copy
- habit copy
- points/reward

When there is no usable input, the adapter returns a compact `needs_input`
message so the product feels responsive without hallucinating a classification.

This keeps the demo stable while still letting Eve improve the language and
decision quality when AI is available.

## Waste Decision Layer

`lib/waste-catalog.ts` is the current product source of truth for household
waste decisions. It defines common residue types, aliases, destinations,
preparation steps, habit rewards, impact copy, and whether the rule is national,
district-specific, or uncertain.

The first catalog slice covers:

- PET bottle
- aluminum can
- cardboard box
- glass bottle
- organic scraps
- thermal receipt
- beverage carton
- dirty flexible plastic
- used battery

Eve can suggest a `residueTypeId`, but the server normalizes the final product
response against the catalog. When a visual answer does not match any known
type, FAYE caps confidence and marks the decision as
`uncertain-household-waste` instead of inventing a new disposal category.

Habit events include the normalized decision metadata in `metadata`, including
`residue_type_id`, `destination`, `rule_scope`, and `normalized`. This keeps the
current table stable while leaving a clear path to future Supabase tables for
residue types, local rules, and district-specific drop-off points.

## Recommended Demo Setup

For the hackathon demo, prefer one direct provider key:

```env
FAYE_AI_PROVIDER=auto
GOOGLE_GENERATIVE_AI_API_KEY=...
FAYE_GOOGLE_MODEL=gemini-2.5-flash
```

OpenAI is also supported:

```env
FAYE_AI_PROVIDER=auto
OPENAI_API_KEY=...
FAYE_OPENAI_MODEL=gpt-4.1-mini
```

Keep `AI_GATEWAY_API_KEY` as a fallback, but do not rely on Gateway free tier for
the live image-recognition moment.
