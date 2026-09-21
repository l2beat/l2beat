/**
 * The seam between the authoring loop and a model.
 *
 * Authoring is the one non-deterministic step of the pipeline, so everything
 * the loop needs from a model is expressed as two calls: start a thread with
 * a prompt, or continue one with a repair message. A turn returns the final
 * message as text, never a parsed plan: parsing and validation belong to the
 * loop so that a fake client in tests exercises the same code paths as the
 * real one. Raw events travel along for the run artifact, which is how a
 * reviewer sees what the model was told and did.
 */
export interface ModelTurnInput {
  prompt: string
  /** The plan schema, for clients that can constrain the final message. */
  schema: object
}

export interface ModelResumeInput extends ModelTurnInput {
  threadId: string
}

export interface ModelUsage {
  inputTokens?: number
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
