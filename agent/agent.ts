import { defineAgent } from "eve"

export default defineAgent({
  model: process.env.FAYE_AI_MODEL ?? "openai/gpt-5.4-mini",
})
