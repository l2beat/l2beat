import { expect } from 'earl'
import { parseHighlightedIds } from './parseHighlightedIds'

describe(parseHighlightedIds.name, () => {
  it('returns no ids for an empty value', () => {
    expect(parseHighlightedIds('')).toEqual([])
  })

  it('parses a single id', () => {
    expect(parseHighlightedIds('risc0')).toEqual(['risc0'])
  })

  it('parses comma-separated ids', () => {
    expect(parseHighlightedIds('sp1hypercube,risc0')).toEqual([
      'sp1hypercube',
      'risc0',
    ])
  })

  it('ignores empty segments', () => {
    expect(parseHighlightedIds(',risc0,')).toEqual(['risc0'])
  })
})
