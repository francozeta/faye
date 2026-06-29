# Eve AI Adapter

FAYE is the app. Eve is the invisible AI layer that helps the product classify a
residue, explain the next action, and convert it into habit progress.

## Current slice

- `agent/` holds the durable Eve source of truth.
- `/api/eve/classify` is the product-facing adapter used by the UI.
- `AI_GATEWAY_API_KEY` or `VERCEL_OIDC_TOKEN` enables real AI through Vercel AI Gateway.
- `FAYE_AI_MODEL` can override the default model (`openai/gpt-5.4-mini`).
- `FAYE_AI_MODEL` must be a model id like `openai/gpt-5.4-mini`, never an API key.
- If the gateway is missing or fails, FAYE returns a deterministic local answer.

## Demo contract

The adapter returns the same shape used by the UI:

- residue identity
- category and destination
- confidence
- recommended preparation
- impact copy
- habit copy
- points/reward

This keeps the demo stable while still letting Eve improve the language and
decision quality when AI is available.
