import { expect } from 'earl'
import {
  highlightSegments,
  NO_MATCH,
  rankSearchTerms,
  toSearchQuery,
  toSearchTerms,
} from './rank'

describe(rankSearchTerms.name, () => {
  const rank = (terms: string[], text: string) =>
    rankSearchTerms(toSearchTerms(terms), toSearchQuery(text))

  it('ranks an exact title above a prefix above a substring', () => {
    const exact = rank(['Bridge'], 'bridge')
    const prefix = rank(['BridgeProxy'], 'bridge')
    const substring = rank(['L1Bridge'], 'bridge')

    expect(exact).toBeGreaterThan(prefix)
    expect(prefix).toBeGreaterThan(substring)
  })

  it('ranks a title match above a match in a later term', () => {
    expect(rank(['Bridge', 'x'], 'bridge')).toBeGreaterThan(
      rank(['x', 'Bridge'], 'bridge'),
    )
  })

  it('requires every token, but lets tokens match different terms', () => {
    expect(rank(['owner', 'L1Bridge'], 'owner bridge')).not.toEqual(NO_MATCH)
    expect(rank(['owner', 'L1Bridge'], 'owner rollup')).toEqual(NO_MATCH)
  })

  it('matches everything with an empty query', () => {
    expect(rank(['anything'], '   ')).toEqual(0)
  })
})

describe(highlightSegments.name, () => {
  it('marks every occurrence of every needle, ignoring case', () => {
    expect(highlightSegments('OwnerBridgeowner', ['owner', 'BRIDGE'])).toEqual([
      { text: 'OwnerBridgeowner', highlighted: true },
    ])
    expect(highlightSegments('a owner b', ['owner'])).toEqual([
      { text: 'a ', highlighted: false },
      { text: 'owner', highlighted: true },
      { text: ' b', highlighted: false },
    ])
  })

  it('returns the text unmarked without needles', () => {
    expect(highlightSegments('abc', [])).toEqual([
      { text: 'abc', highlighted: false },
    ])
    expect(highlightSegments('', ['a'])).toEqual([])
  })
})
