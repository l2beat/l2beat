import type { ClingoResult } from 'clingo-wasm/dist/run.js'
import { expect } from 'earl'
import { runClingo } from './runClingo.js'

describe(runClingo.name, () => {
  it('runs clingo on passed program', async () => {
    const program = 'a. b :- a.'
    const result = await runClingo(program)
    expect(result.Result).toEqual('SATISFIABLE')
    expect((result as ClingoResult).Call?.[0]?.Witnesses?.[0]?.Value).toEqual([
      'a',
      'b',
    ])
  })
})
