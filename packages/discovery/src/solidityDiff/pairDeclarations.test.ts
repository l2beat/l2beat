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

  it('pairs identical declarations before those sharing a title', () => {
    const [left, right] = pair(
      'contract C { function f(uint a) public {} function f() public {} }',
      'contract C { function f() public {} }',
    )
    expect(Object.keys(left.children['contract C']?.subNodes ?? {})).toEqual([
      'function f',
      'function f #2',
    ])
    expect(Object.keys(right.children['contract C']?.subNodes ?? {})).toEqual([
      'function f #2',
    ])
  })

  it('pairs a renamed contract that keeps most of its declarations', () => {
    const [left, right] = pair(
      'contract A { uint x; uint y; } contract B { uint z; }',
      'contract D { uint x; uint y; uint w; } contract E { uint v; }',
    )
    expect(Object.keys(left.children)).toEqual(['contract A', 'contract B'])
    expect(Object.keys(right.children)).toEqual(['contract A', 'contract E'])
  })

  it('pairs renamed contracts by the most shared declarations', () => {
    const contract = (name: string, last: string) =>
      `contract ${name} { function f() public {} function g() public {} function ${last}() public {} }`
    const [left, right] = pair(
      [contract('A', 'h'), contract('B', 'x')].join('\n'),
      [contract('Y', 'x'), contract('Z', 'h')].join('\n'),
    )
    expect(Object.keys(left.children)).toEqual(['contract A', 'contract B'])
    expect(Object.keys(right.children)).toEqual(['contract B', 'contract A'])
  })

  it('counts an overloaded title once per declaration', () => {
    const plain = (name: string) =>
      `contract ${name} { function f() public {} function x() public {} function y() public {} }`
    const overloads = (name: string) =>
      `contract ${name} { function f(uint a) public {} function f(bool b) public {} function f(address c) public {} }`
    const [left, right] = pair(
      [plain('A'), overloads('B')].join('\n'),
      [overloads('Y'), plain('Z')].join('\n'),
    )
    expect(Object.keys(left.children)).toEqual(['contract A', 'contract B'])
    expect(Object.keys(right.children)).toEqual(['contract B', 'contract A'])
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
