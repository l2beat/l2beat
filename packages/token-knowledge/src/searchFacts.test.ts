import { expect } from 'earl'
import type { ClingoFact } from './clingo/parseClingoFact'
import { factToString, searchFacts } from './searchFacts'

const FACTS: ClingoFact[] = [
  {
    atom: 'transfer',
    params: ['ethereum', '0xabc', 'base', '0x123', 'hop', 'lockAndMint'],
  },
  {
    atom: 'transfer',
    params: ['base', '0x123', 'zora', '0x456', 'hop', 'lockAndMint'],
  },
  { atom: 'cgId', params: ['ethereum', '0xabc', 'usd-coin'] },
  { atom: 'sameAbstract', params: ['ethereum', '0xabc', 'base', '0x123'] },
]

describe(factToString.name, () => {
  it('converts fact to string representation', () => {
    expect(factToString(FACTS[0]!)).toEqual(
      'transfer(ethereum, 0xabc, base, 0x123, hop, lockAndMint)',
    )
  })

  it('handles fact with no params', () => {
    expect(factToString({ atom: 'empty', params: [] })).toEqual('empty')
  })

  it('handles nested facts', () => {
    const nested: ClingoFact = {
      atom: 'outer',
      params: [{ atom: 'inner', params: ['a', 'b'] }, 'c'],
    }
    expect(factToString(nested)).toEqual('outer(inner(a, b), c)')
  })

  it('handles numeric params', () => {
    expect(factToString({ atom: 'num', params: [42, -3.14] })).toEqual(
      'num(42, -3.14)',
    )
  })
})

describe(searchFacts.name, () => {
  it('returns all facts for empty query', () => {
    expect(searchFacts(FACTS, '')).toEqual(FACTS)
  })

  it('matches atom name', () => {
    const results = searchFacts(FACTS, 'cgId')
    expect(results.length).toEqual(1)
    expect(results[0]!.atom).toEqual('cgId')
  })

  it('matches string parameter', () => {
    const results = searchFacts(FACTS, '0x456')
    expect(results.length).toEqual(1)
    expect(results[0]!.atom).toEqual('transfer')
    expect(results[0]!.params[3]).toEqual('0x456')
  })

  it('is case-insensitive', () => {
    const results = searchFacts(FACTS, 'ETHEREUM')
    expect(results.length).toEqual(3)
  })

  it('returns empty array when no matches', () => {
    expect(searchFacts(FACTS, 'nonexistent')).toEqual([])
  })

  it('supports regex patterns', () => {
    const results = searchFacts(FACTS, 'zora|cgId')
    expect(results.length).toEqual(2)
  })

  it('matches across atom and params', () => {
    const results = searchFacts(FACTS, 'usd-coin')
    expect(results.length).toEqual(1)
    expect(results[0]!.atom).toEqual('cgId')
  })

  it('falls back to substring match on invalid regex', () => {
    const results = searchFacts(FACTS, '[invalid')
    expect(results).toEqual([])

    const results2 = searchFacts(FACTS, '[ethereum')
    expect(results2).toEqual([])
  })
})
