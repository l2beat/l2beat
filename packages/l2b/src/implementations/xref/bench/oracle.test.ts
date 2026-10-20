import { expect } from 'earl'
import { selectorOf } from './oracle'
import type { FunctionNode, VariableNode } from './SolcAst'

describe(selectorOf.name, () => {
  it('prefers the selector the compiler wrote', () => {
    expect(selectorOf(fn('transfer', [], 'cafebabe'))).toEqual('cafebabe')
  })

  it('computes selectors for compilers that do not write them', () => {
    const transfer = fn('transfer', ['contract IERC20', 'uint256'])
    const setMode = fn('setMode', ['enum Mode', 'address payable'])

    expect(selectorOf(transfer)).toEqual('a9059cbb')
    expect(selectorOf(setMode)).toEqual(
      selectorOf(fn('setMode', ['uint8', 'address'])),
    )
  })

  it('gives up on structs instead of guessing', () => {
    expect(selectorOf(fn('submit', ['struct Batch memory']))).toEqual(undefined)
  })
})

function fn(name: string, types: string[], selector?: string): FunctionNode {
  return {
    id: 1,
    nodeType: 'FunctionDefinition',
    src: '0:0:0',
    name,
    kind: 'function',
    implemented: true,
    visibility: 'external',
    functionSelector: selector,
    parameters: {
      parameters: types.map(
        (typeString) => ({ typeDescriptions: { typeString } }) as VariableNode,
      ),
    },
  }
}
