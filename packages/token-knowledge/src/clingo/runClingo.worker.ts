import { parentPort } from 'node:worker_threads'
import type { ClingoError, ClingoResult } from 'clingo-wasm'
import { getClingoRun } from './getClingoRun'

const port = parentPort

if (!port) {
  throw new Error('runClingo worker requires parentPort')
}

port.once('message', async ({ program }: { program: string }) => {
  const clingoModule = (await import('clingo-wasm')) as unknown as {
    default?: {
      run?: (
        program: string,
        models?: number,
      ) => Promise<ClingoResult | ClingoError>
    }
    run?: (
      program: string,
      models?: number,
    ) => Promise<ClingoResult | ClingoError>
  }
  const run = getClingoRun(clingoModule)
  const result = (await run(program, 0)) as ClingoResult | ClingoError
  port.postMessage(result)
})
