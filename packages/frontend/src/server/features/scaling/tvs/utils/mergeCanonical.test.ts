import { expect } from 'earl'
import { mergeCanonical } from './mergeCanonical'

describe(mergeCanonical.name, () => {
  it('merges canonical and customCanonical into one canonical and omits customCanonical', () => {
    const full = mergeCanonical({
      projectId: 'foo',
      timestamp: 1_700_000_000,
      value: 100,
      canonical: 10,
      customCanonical: 5,
      external: 1,
      native: 2,
      ether: 3,
      stablecoin: 4,
      btc: 5,
      rwaRestricted: 6,
      rwaPublic: 7,
      other: 8,
    })

    expect(full).toEqual({
      projectId: 'foo',
      timestamp: 1_700_000_000,
      value: 100,
      canonical: 15,
      external: 1,
      native: 2,
      ether: 3,
      stablecoin: 4,
      btc: 5,
      rwaRestricted: 6,
      rwaPublic: 7,
      other: 8,
    })

    expect(mergeCanonical({ canonical: 42, customCanonical: 0 })).toEqual({
      canonical: 42,
    })
  })
})
