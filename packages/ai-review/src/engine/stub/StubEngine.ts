import type { Engine, EngineRequest, EngineResult } from '../types.js'

/** Returns a fixed result without running anything. */
export class StubEngine implements Engine {
  readonly name = 'stub'

  constructor(private readonly result: EngineResult) {}

  /** A successful run whose final message is `output`. */
  static withOutput(output: unknown): StubEngine {
    return new StubEngine({ ok: true, output, commands: [] })
  }

  /** A failed run for environments without engine credentials; never reads as a clean review. */
  static unavailable(): StubEngine {
    return new StubEngine({
      ok: false,
      reason: 'engine-error',
      detail:
        'stub engine: no Codex credentials configured, no review performed',
    })
  }

  run(_request: EngineRequest): Promise<EngineResult> {
    return Promise.resolve(this.result)
  }
}
