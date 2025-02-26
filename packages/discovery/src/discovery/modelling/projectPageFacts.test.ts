import { expect } from 'earl'
import { runClingo } from './projectPageFacts'

// TODO:
// `clingo-wasm` (or more precisely, emscripten's binding to wasm)
// seems to modify the global nodejs's Error prototype chain to
// add custom serialization/deserialization logic for WebAssembly exceptions.
// This seems to conflicts with `makeEthersError` in our codebase.
// Until it's fixed, this test is disabled.
xdescribe(runClingo.name, () => {
  it('runs clingo on passed program', async () => {
    const program = 'a. b :- a.'
    const result = await runClingo(program)
    expect(result.Result).toEqual('SATISFIABLE')
    expect(result.Call?.[0]?.Witnesses?.[0]?.Value).toEqual(['a', 'b'])
  })
})
