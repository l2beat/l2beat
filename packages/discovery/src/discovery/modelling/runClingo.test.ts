import { expect } from 'earl'
import { runClingoForSingleModel } from './modelPermissions'
import { runClingo } from './runClingo'

const VALID_PROGRAM = 'a. b :- a.'
const SYNTAX_ERROR_PROGRAM = 'a :- b(.'
const WASM_STACK_BYTES = 1024 * 1024

describe(runClingo.name, () => {
  it('runs clingo on passed program', async () => {
    const result = await runClingo(VALID_PROGRAM)
    expect(result.Result).toEqual('SATISFIABLE')
    if (result.Result === 'ERROR') return
    expect(result.Call?.[0]?.Witnesses?.[0]?.Value).toEqual(['a', 'b'])
  })
})

// The update monitor models every project through one long-lived process.
// Each failure below once left the clingo runtime unusable, so every later
// project failed with an empty error until the backend was restarted.
describe(runClingoForSingleModel.name, () => {
  it('returns the facts of a valid program', async () => {
    expect(await runClingoForSingleModel(VALID_PROGRAM)).toEqual(['a', 'b'])
  })

  it('reports a syntax error with the clingo diagnostic', async () => {
    const message = await rejectionMessage(
      runClingoForSingleModel(SYNTAX_ERROR_PROGRAM),
    )
    expect(message).toInclude('syntax error')
  })

  it('reports a program larger than the wasm stack with a message', async () => {
    const message = await rejectionMessage(
      runClingoForSingleModel(programOfSize(WASM_STACK_BYTES + 64 * 1024)),
    )
    expect(message).not.toEqual('')
  })

  it('recovers after a syntax error', async () => {
    await rejectionMessage(runClingoForSingleModel(SYNTAX_ERROR_PROGRAM))
    expect(await runClingoForSingleModel(VALID_PROGRAM)).toEqual(['a', 'b'])
  })

  it('recovers after a program larger than the wasm stack', async () => {
    await rejectionMessage(
      runClingoForSingleModel(programOfSize(WASM_STACK_BYTES + 64 * 1024)),
    )
    expect(await runClingoForSingleModel(VALID_PROGRAM)).toEqual(['a', 'b'])
  })

  it('recovers after twelve consecutive 100 KB failures', async () => {
    const failing = programOfSize(100 * 1024) + '\n' + SYNTAX_ERROR_PROGRAM
    for (let i = 0; i < 12; i++) {
      await rejectionMessage(runClingoForSingleModel(failing))
    }
    expect(await runClingoForSingleModel(VALID_PROGRAM)).toEqual(['a', 'b'])
  })

  it('serves concurrent runs independently of each other', async () => {
    const results = await Promise.allSettled([
      runClingoForSingleModel(VALID_PROGRAM),
      runClingoForSingleModel(SYNTAX_ERROR_PROGRAM),
      runClingoForSingleModel(programOfSize(WASM_STACK_BYTES + 64 * 1024)),
      runClingoForSingleModel(VALID_PROGRAM),
    ])
    expect(results[0]).toEqual({ status: 'fulfilled', value: ['a', 'b'] })
    expect(results[1]?.status).toEqual('rejected')
    expect(results[2]?.status).toEqual('rejected')
    expect(results[3]).toEqual({ status: 'fulfilled', value: ['a', 'b'] })
  })
})

async function rejectionMessage(promise: Promise<unknown>): Promise<string> {
  try {
    await promise
  } catch (error) {
    expect(error).toBeA(Error)
    return (error as Error).message
  }
  throw new Error('Expected the run to be rejected')
}

function programOfSize(bytes: number): string {
  const facts: string[] = []
  let size = 0
  for (let i = 0; size < bytes; i++) {
    const fact = `p(${i}).`
    facts.push(fact)
    size += fact.length + 1
  }
  return facts.join('\n')
}
