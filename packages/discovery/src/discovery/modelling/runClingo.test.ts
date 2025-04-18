import { expect } from 'earl'
import { runClingo } from './runClingo'

describe(runClingo.name, () => {
  it('runs clingo on passed program', async () => {
    const program = 'a. b :- a.'
    const result = await runClingo(program)
    expect(result.Result).toEqual('SATISFIABLE')
    expect(result.Call?.[0]?.Witnesses?.[0]?.Value).toEqual(['a', 'b'])
  })
})
