import { assert } from '@l2beat/shared-pure'

const PROGRAM_BYTES_MAX = 1000 * 1024

let queue: Promise<unknown> = Promise.resolve()

export async function runClingo(program: string) {
  const programBytes = Buffer.byteLength(program)
  assert(
    programBytes <= PROGRAM_BYTES_MAX,
    `Clingo program of ${programBytes} bytes exceeds the limit of ${PROGRAM_BYTES_MAX} bytes`,
  )
  const result = queue.then(() => runClingoOnFreshWorkerAfterTrap(program))
  queue = result.catch(() => {})
  return await result
}

async function runClingoOnFreshWorkerAfterTrap(program: string) {
  const { run, restart } = await import('clingo-wasm')
  const result = await run(program, 0)
  if (result.Result === 'ERROR' && result.Error.startsWith('RuntimeError')) {
    await restart()
  }
  return result
}
