import type { ClingoError, ClingoResult } from 'clingo-wasm'

export type { ClingoError, ClingoResult }

type RunFn = (
  program: string,
  models?: number,
) => ClingoResult | ClingoError | Promise<ClingoResult | ClingoError>

let runnerPromise: Promise<RunFn> | null = null

function getRunner(): Promise<RunFn> {
  if (!runnerPromise) {
    runnerPromise = (async () => {
      const clingoModule = await import('clingo-wasm')
      // Handle both ESM and CommonJS module formats
      // @ts-ignore
      const init = clingoModule.default?.init ?? clingoModule.init
      return init()
    })()
  }
  return runnerPromise
}

export async function runClingo(
  program: string,
): Promise<ClingoResult | ClingoError> {
  const run = await getRunner()
  const result = await run(program, 0)
  // When clingo-wasm hits a syntax error, the underlying ccall throws
  // mid-execution and the Emscripten line-buffered stdout is left with an
  // unflushed partial line. That partial line then leaks into the beginning
  // of the next run's output and produces malformed JSON, so any subsequent
  // inference fails with a generic parse error. Drop the cached runner so
  // the next call spins up a fresh, clean WASM instance.
  if (result.Result === 'ERROR') {
    runnerPromise = null
  }
  return result
}

export function extractFacts(result: ClingoResult | ClingoError): string[] {
  if (result.Result === 'ERROR') {
    throw new Error(`Clingo error: ${result.Error}`)
  }
  if (result.Result !== 'SATISFIABLE') {
    throw new Error(`Clingo result: ${result.Result}`)
  }
  const witness = result.Call[0]?.Witnesses[0]
  if (!witness) {
    throw new Error('No witness found in Clingo result')
  }
  return witness.Value
}
