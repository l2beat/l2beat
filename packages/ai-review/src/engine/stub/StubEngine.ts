import type { Engine, EngineRequest, EngineResult } from '../types.js'

/** Returns a fixed schema-valid output; used in dev runs without credentials. */
export class StubEngine implements Engine {
  readonly name = 'stub'

  constructor(private readonly output: unknown) {}

  run(_request: EngineRequest): Promise<EngineResult> {
    return Promise.resolve({
      ok: true,
      output: this.output,
      usage: { input: 0, cachedInput: 0, output: 0 },
      commands: [],
    })
  }
}
