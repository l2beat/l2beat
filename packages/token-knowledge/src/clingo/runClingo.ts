import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import type { ClingoError, ClingoResult } from 'clingo-wasm'

export type { ClingoError, ClingoResult }

export interface RunClingoOptions {
  timeoutMs?: number
}

function getWorkerPath() {
  return join(
    __dirname,
    __filename.endsWith('.ts') ? 'runClingo.worker.ts' : 'runClingo.worker.js',
  )
}

function getWorkerExecArgv() {
  if (__filename.endsWith('.ts')) {
    return ['-r', 'esbuild-register']
  }
  return undefined
}

export async function runClingo(
  program: string,
  options: RunClingoOptions = {},
): Promise<ClingoResult | ClingoError> {
  const worker = new Worker(getWorkerPath(), {
    execArgv: getWorkerExecArgv(),
  })

  return await new Promise((resolve) => {
    let settled = false
    let timeout: ReturnType<typeof setTimeout> | undefined

    const finish = (result: ClingoResult | ClingoError) => {
      if (settled) {
        return
      }
      settled = true
      if (timeout) {
        clearTimeout(timeout)
      }
      void worker.terminate()
      resolve(result)
    }

    worker.once('message', (result: ClingoResult | ClingoError) => {
      finish(result)
    })

    worker.once('error', (error) => {
      finish({
        Result: 'ERROR',
        Error: error.message,
      })
    })

    worker.once('exit', (code) => {
      if (code !== 0) {
        finish({
          Result: 'ERROR',
          Error: `Clingo worker exited with code ${code}`,
        })
      }
    })

    if (options.timeoutMs !== undefined) {
      timeout = setTimeout(() => {
        finish({
          Result: 'ERROR',
          Error: `Clingo timed out after ${options.timeoutMs}ms`,
        })
      }, options.timeoutMs)
    }

    worker.postMessage({ program })
  })
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
