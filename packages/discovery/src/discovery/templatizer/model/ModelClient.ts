/**
 * The seam between the templatizer loop and a model.
 *
 * Drafting a template is the one non-deterministic step of templatizing, so
 * everything the loop needs from a model is expressed as two calls: start a
 * thread with a prompt, or continue one with a repair message. A turn
 * returns the final message as text, never a parsed draft: parsing,
 * validation and the dry run belong to the loop so that a fake client in
 * tests exercises the same code paths as the real one. Raw events travel
 * along for the run artifact, which is how a reviewer sees what the model
 * was told and did.
 */
export interface ModelTurnInput {
  prompt: string
  /** The draft schema, for clients that can constrain the final message. */
  schema: object
}

export interface ModelResumeInput extends ModelTurnInput {
  threadId: string
}

export interface ModelUsage {
  /** The whole prompt, cached part included, whichever provider reported it. */
  inputTokens?: number
  /** The part of `inputTokens` served from the provider's prompt cache. */
  cachedInputTokens?: number
  outputTokens?: number
  reasoningOutputTokens?: number
}

export interface ModelTurn {
  threadId: string
  /** The final message of the turn. */
  text: string
  model?: string
  usage?: ModelUsage
  /** Raw JSONL events, for the artifact. */
  events: unknown[]
  durationMs: number
}

export interface ModelClient {
  start(input: ModelTurnInput): Promise<ModelTurn>
  resume(input: ModelResumeInput): Promise<ModelTurn>
}
