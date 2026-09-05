import { expect } from 'earl'
import { getCanonicalAgeKnots } from './curve'

function release(ages: unknown[]) {
  return {
    formatVersion: 2,
    incidents: ages.map((codeAgeSeconds) => ({ codeAgeSeconds })),
    excluded: [{ codeAgeSeconds: 999 }],
  }
}

function manifest(count: number) {
  return { formatVersion: 2, counts: { curveIncidents: count } }
}

describe(getCanonicalAgeKnots.name, () => {
  it('preserves zero ages and repeated incident ages, ignoring excluded records', () => {
    expect(getCanonicalAgeKnots(release([0, 12, 12, 24]), manifest(4))).toEqual(
      [0, 12, 12, 24],
    )
  })

  it('rejects future versions even when both producer files agree', () => {
    expect(() =>
      getCanonicalAgeKnots(
        { ...release([12]), formatVersion: 3 },
        { ...manifest(1), formatVersion: 3 },
      ),
    ).toThrow()
  })

  it('rejects a manifest from a different format', () => {
    expect(() =>
      getCanonicalAgeKnots(release([12]), {
        ...manifest(1),
        formatVersion: 1,
      }),
    ).toThrow()
  })

  it('rejects an empty curve', () => {
    expect(() => getCanonicalAgeKnots(release([]), manifest(0))).toThrow()
  })

  it('rejects unsorted ages', () => {
    expect(() => getCanonicalAgeKnots(release([24, 12]), manifest(2))).toThrow()
  })

  it('rejects invalid ages', () => {
    for (const age of [
      -1,
      0.5,
      '12',
      null,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      2 ** 53,
    ]) {
      expect(() => getCanonicalAgeKnots(release([age]), manifest(1))).toThrow()
    }
  })

  it('rejects a count mismatch', () => {
    expect(() => getCanonicalAgeKnots(release([12]), manifest(2))).toThrow()
  })
})
