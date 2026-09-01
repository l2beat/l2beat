import { CodexEngine } from './codex/CodexEngine.js'
import { StubEngine } from './stub/StubEngine.js'
import type { Engine } from './types.js'

/** Picks the engine from `ENGINE`; anything but `codex` runs the unavailable stub. */
export function createEngine(env: NodeJS.ProcessEnv): Engine {
  return env.ENGINE === 'codex'
    ? new CodexEngine({ model: env.CODEX_MODEL, reasoningEffort: 'medium' })
    : StubEngine.unavailable()
}
