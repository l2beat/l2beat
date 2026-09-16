import { describe, expect, it } from 'vitest'
import { parseHighlightedIds } from './parseHighlightedIds'

describe(parseHighlightedIds.name, () => {
  it('returns no ids for an empty value', () => {
    expect(parseHighlightedIds('')).toStrictEqual([])
  })

  it('parses a single id', () => {
    expect(parseHighlightedIds('risc0')).toStrictEqual(['risc0'])
  })

  it('parses comma-separated ids', () => {
    expect(parseHighlightedIds('sp1hypercube,risc0')).toStrictEqual([
      'sp1hypercube',
      'risc0',
    ])
  })

  it('ignores empty segments', () => {
    expect(parseHighlightedIds(',risc0,')).toStrictEqual(['risc0'])
  })
})
