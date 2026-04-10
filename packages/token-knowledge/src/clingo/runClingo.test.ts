import { expect } from 'earl'
import { extractFacts, runClingo } from './runClingo'

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
    expect(() => extractFacts({ Result: 'UNSATISFIABLE', Call: [] })).toThrow(
      'Clingo result: UNSATISFIABLE',
    )
  })
})
