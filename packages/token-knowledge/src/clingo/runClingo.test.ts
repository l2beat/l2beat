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
