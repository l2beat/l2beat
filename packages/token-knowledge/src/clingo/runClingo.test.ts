import { expect } from 'earl'
import {
  type ClingoError,
  type ClingoResult,
  extractFacts,
  runClingo,
} from './runClingo'

describe(runClingo.name, () => {
  it('runs a simple program and returns SATISFIABLE', async () => {
    const result = await runClingo('a. b :- a.')
    expect(result.Result).toEqual('SATISFIABLE')
  })

  it('produces witnessed facts', async () => {
    const result = await runClingo('a. b :- a.')
    const facts = extractFacts(result)
    expect(facts).toEqual(['a', 'b'])
  })

  it('recovers after a syntax error in a previous run', async () => {
    // Emscripten's stdout is line-buffered; a failing ccall leaves a partial
    // line in the buffer that would corrupt the next run's JSON output unless
    // the runner is discarded and re-initialized.
    const ok = await runClingo('a. b :- a.')
    expect(ok.Result).toEqual('SATISFIABLE')

    const bad = await runClingo('this is not valid clingo')
    expect(bad.Result).toEqual('ERROR')

    const again = await runClingo('x. y :- x.')
    expect(again.Result).toEqual('SATISFIABLE')
    expect(extractFacts(again)).toEqual(['x', 'y'])
  })
})

describe(extractFacts.name, () => {
  it('throws on non-satisfiable result', () => {
    const result = { Result: 'UNSATISFIABLE', Call: [] } as unknown as
      | ClingoResult
      | ClingoError
    expect(() => extractFacts(result)).toThrow('Clingo result: UNSATISFIABLE')
  })

  it('throws with error details on ERROR result', () => {
    const result: ClingoError = {
      Result: 'ERROR',
      Error: 'parsing failed: syntax error',
    }
    expect(() => extractFacts(result)).toThrow(
      'Clingo error: parsing failed: syntax error',
    )
  })
})
