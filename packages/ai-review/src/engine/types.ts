export interface EngineRequest {
  cwd: string
  prompt: string
  /** JSON Schema the final message must conform to. */
  outputSchema: object
  budget: Budget
}

export interface Budget {
  timeoutMs: number
}

export interface TokenUsage {
  input: number
  cachedInput: number
  output: number
}

/** `usage` is absent when the engine did not report it (e.g. died before its final turn). */
export type EngineResult =
  | { ok: true; output: unknown; usage?: TokenUsage; commands: string[] }
  | {
      ok: false
      reason: 'timeout' | 'engine-error' | 'invalid-output'
      detail: string
      usage?: TokenUsage
    }

export interface Engine {
  readonly name: string
  run(request: EngineRequest): Promise<EngineResult>
}
