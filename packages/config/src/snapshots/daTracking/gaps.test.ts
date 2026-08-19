import { expect } from 'earl'
import { findCoverageGaps, type TrackedRange } from './gaps'

describe(findCoverageGaps.name, () => {
  const entry = (
    since: number,
    until?: number,
    daLayer = 'ethereum',
  ): TrackedRange => ({
    daLayer,
    label: `${daLayer} ${since}`,
    since,
    until,
  })

  it('accepts a single open entry', () => {
    expect(findCoverageGaps([entry(100)])).toEqual([])
  })

  it('accepts a trailing closed entry', () => {
    expect(findCoverageGaps([entry(100, 200)])).toEqual([])
    expect(findCoverageGaps([entry(100, 200), entry(201, 300)])).toEqual([])
  })

  it('accepts touching entries', () => {
    expect(findCoverageGaps([entry(100, 200), entry(200)])).toEqual([])
  })

  it('accepts adjacent entries (next.since === prev.until + 1)', () => {
    expect(findCoverageGaps([entry(100, 200), entry(201)])).toEqual([])
  })

  it('accepts overlapping entries', () => {
    expect(findCoverageGaps([entry(100, 250), entry(150)])).toEqual([])
  })

  it('accepts an entry fully contained in another', () => {
    expect(
      findCoverageGaps([entry(100), entry(150, 160), entry(170, 180)]),
    ).toEqual([])
  })

  it('reports a hole between a closed entry and its successor', () => {
    expect(findCoverageGaps([entry(100, 200), entry(202)])).toEqual([
      {
        daLayer: 'ethereum',
        from: 201,
        to: 201,
        before: entry(100, 200),
        after: entry(202),
      },
    ])
  })

  it('reports the hole after the furthest reaching entry, not the last one', () => {
    // The overlapping entry ends earlier than the first one - the frontier
    // must not go backwards.
    expect(
      findCoverageGaps([entry(100, 500), entry(200, 300), entry(600)]),
    ).toEqual([
      {
        daLayer: 'ethereum',
        from: 501,
        to: 599,
        before: entry(100, 500),
        after: entry(600),
      },
    ])
  })

  it('reports multiple holes', () => {
    expect(
      findCoverageGaps([entry(100, 200), entry(300, 400), entry(500)]),
    ).toEqual([
      {
        daLayer: 'ethereum',
        from: 201,
        to: 299,
        before: entry(100, 200),
        after: entry(300, 400),
      },
      {
        daLayer: 'ethereum',
        from: 401,
        to: 499,
        before: entry(300, 400),
        after: entry(500),
      },
    ])
  })

  it('is not confused by unsorted input', () => {
    expect(findCoverageGaps([entry(300), entry(100, 200)])).toEqual([
      {
        daLayer: 'ethereum',
        from: 201,
        to: 299,
        before: entry(100, 200),
        after: entry(300),
      },
    ])
  })

  it('compares entries per DA layer', () => {
    // A closed ethereum range followed by a celestia range is a layer switch,
    // not a hole - the layers have unrelated units.
    expect(
      findCoverageGaps([entry(100, 200), entry(5, undefined, 'celestia')]),
    ).toEqual([])
  })

  it('applies the same rules to eigen-da timestamps', () => {
    const eigen = (since: number, until?: number) =>
      entry(since, until, 'eigenda')
    expect(
      findCoverageGaps([eigen(1700000000, 1700003600), eigen(1700003601)]),
    ).toEqual([])
    expect(
      findCoverageGaps([eigen(1700000000, 1700003600), eigen(1700007200)]),
    ).toEqual([
      {
        daLayer: 'eigenda',
        from: 1700003601,
        to: 1700007199,
        before: eigen(1700000000, 1700003600),
        after: eigen(1700007200),
      },
    ])
  })
})
