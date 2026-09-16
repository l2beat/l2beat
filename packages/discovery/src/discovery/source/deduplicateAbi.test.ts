import { describe, expect, it } from 'vitest'

import { deduplicateAbi } from './deduplicateAbi'

describe(deduplicateAbi.name, () => {
  it('returns deduplicated and sorted abi', () => {
    const result = deduplicateAbi([
      'function foo()',
      'function bar()',
      'function baz()',
      'function bar()',
    ])

    expect(result).toStrictEqual([
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

    expect(result).toStrictEqual(['constructor(uint a, uint b)'])
  })

  it('only keeps the first function', () => {
    const result = deduplicateAbi([
      'function foo(uint a, uint b)',
      'function foo(uint c, uint d)',
    ])

    expect(result).toStrictEqual(['function foo(uint a, uint b)'])
  })

  it('filters out invalid strings', () => {
    const result = deduplicateAbi(['function foo()', 'foo bar baz', '12345'])

    expect(result).toStrictEqual(['function foo()'])
  })

  it('prefers view or pure functions even if they are late', () => {
    // We added this because we care more about view or pure functions
    // Some proxies defined similar functions but skipped the modifiers

    const result = deduplicateAbi([
      'function foo(uint a, uint b)',
      'function foo(uint c, uint d) view returns (uint)',
      'function foo(uint e, uint f) pure returns (uint)',
      'function bar(uint a, uint b)',
      'function bar(uint c, uint d) pure returns (uint)',
      'function bar(uint e, uint f) view returns (uint)',
    ])

    expect(result).toStrictEqual([
      'function bar(uint e, uint f) view returns (uint)',
      'function foo(uint e, uint f) pure returns (uint)',
    ])
  })
})
