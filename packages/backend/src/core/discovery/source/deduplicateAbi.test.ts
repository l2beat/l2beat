import { expect } from 'earl'

import { deduplicateAbi } from './deduplicateAbi'

describe(deduplicateAbi.name, () => {
  it('returns deduplicated and sorted abi', () => {
    const result = deduplicateAbi([
      'function foo()',
      'function bar()',
      'function baz()',
      'function bar()',
    ])

    expect(result).toEqual([
      'function bar()',
      'function baz()',
      'function foo()',
    ])
  })

  it('only keeps the first constructor', () => {
    const result = deduplicateAbi([
      'constructor(uint a, uint b)',
      'constructor(string foo)',
    ])

    expect(result).toEqual(['constructor(uint a, uint b)'])
  })

  it('filters out invalid strings', () => {
    const result = deduplicateAbi(['function foo()', 'foo bar baz', '12345'])

    expect(result).toEqual(['function foo()'])
  })
})
