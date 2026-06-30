import { defineAgent } from "eve"

export default defineAgent({
  model: process.env.FAYE_AI_MODEL ?? "google/gemini-2.5-flash"
})
