import { expect } from 'earl'
import { parseHighlightedIds } from './parseHighlightedIds'

describe(parseHighlightedIds.name, () => {
  it('returns no ids when the param is absent', () => {
    expect(parseHighlightedIds('?foo=bar')).toEqual([])
  })

  it('parses a single id', () => {
    expect(parseHighlightedIds('?highlight=risc0')).toEqual(['risc0'])
  })

  it('parses comma-separated ids', () => {
    expect(parseHighlightedIds('?highlight=sp1hypercube,risc0')).toEqual([
      'sp1hypercube',
      'risc0',
    ])
  })

  it('parses repeated params', () => {
    expect(
      parseHighlightedIds('?highlight=sp1hypercube&highlight=risc0'),
    ).toEqual(['sp1hypercube', 'risc0'])
  })

  it('ignores empty values', () => {
    expect(parseHighlightedIds('?highlight=,risc0,&highlight=')).toEqual([
      'risc0',
    ])
  })
})
