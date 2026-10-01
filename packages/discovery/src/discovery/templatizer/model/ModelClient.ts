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

/**
 * A turn that ran but whose answer cannot be used: the model called a tool,
 * or ended without text. A fresh sample usually behaves, so the loop asks
 * again. Every other failure (a timeout, an API error such as a spent quota
 * or a rate limit, a CLI that exits with an error or does not start) means
 * the model is not answering, and asking again would only spend the
 * remaining rounds of this contract and the next on the same failure.
 */
export function isRetryable(error: unknown): boolean {
  return (
    typeof error === 'object' &&
    error !== null &&
    'retryable' in error &&
    error.retryable === true
  )
}

/** The model did not answer a turn; the loop stops at once rather than spend its rounds. */
export class ModelUnavailableError extends Error {
  constructor(message: string, options?: ErrorOptions) {
    super(message, options)
    this.name = 'ModelUnavailableError'
  }
}
