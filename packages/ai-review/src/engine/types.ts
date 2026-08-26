export interface EngineRequest {
  cwd: string
  prompt: string
  /** JSON Schema the final message must conform to. */
  outputSchema: object
  budget: StageBudget
}

export interface StageBudget {
  maxTokens: number
  timeoutMs: number
}

export interface TokenUsage {
  input: number
  cachedInput: number
  output: number
}

export type EngineResult =
  | { ok: true; output: unknown; usage: TokenUsage; commands: string[] }
  | {
      ok: false
      reason: 'timeout' | 'over-budget' | 'engine-error' | 'invalid-output'
      detail: string
      usage?: TokenUsage
    }

export interface Engine {
  readonly name: string
  run(request: EngineRequest): Promise<EngineResult>
}
