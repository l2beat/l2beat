import { expect } from 'earl'
import { normalize } from './normalize'
import { pairDeclarations } from './pairDeclarations'

describe(pairDeclarations.name, () => {
  it('keys declarations by title, overloads by occurrence', () => {
    const source =
      'pragma solidity 0.8.0; contract C { function f(uint a) public {} function f() public {} event E(address); }'
    const [left, right] = pair(source, source)
    expect(Object.keys(left.children)).toEqual([
      'pragma solidity',
      'contract C',
    ])
    expect(Object.keys(left.children['contract C']?.subNodes ?? {})).toEqual([
      'function f',
      'function f #2',
      'event E',
    ])
    expect(right).toEqual(left)
  })
})

interface Keyed {
  children: Record<string, { subNodes: Record<string, unknown> }>
}

function pair(before: string, after: string): [Keyed, Keyed] {
  const left = normalize(before, [])
  const right = normalize(after, [])
  pairDeclarations(left, right)
  return [left as unknown as Keyed, right as unknown as Keyed]
}
