import { expect } from 'earl'
import type { InsightHolding } from '~/server/features/insight/InsightReport'
import { groupValueByIssuer } from './groupValueByIssuer'

// Methodology: holdings whose issuer and value are chosen so each rule shows
// in the output: summing per issuer, ranking, merging past the cap, keeping
// no-issuer value apart and skipping unpriced or empty holdings.
describe(groupValueByIssuer.name, () => {
  it('sums, ranks, merges the tail and keeps no-issuer value last', () => {
    const holdings = [
      holding('circle', 30),
      holding('ethereum', 100),
      holding(null, 50),
      holding('circle', 20),
      holding('lido', 10),
      holding('tether', 5),
      holding('frax', null),
      holding('hex', 0),
    ]

    expect(groupValueByIssuer(holdings, 2)).toEqual([
      { kind: 'issuer', issuer: 'ethereum', valueUsd: 100 },
      { kind: 'issuer', issuer: 'circle', valueUsd: 50 },
      { kind: 'others', issuerCount: 2, valueUsd: 15 },
      { kind: 'none', valueUsd: 50 },
    ])
  })

  it('leaves out the segments it has nothing for', () => {
    expect(groupValueByIssuer([holding('lido', 7)], 3)).toEqual([
      { kind: 'issuer', issuer: 'lido', valueUsd: 7 },
    ])
    expect(groupValueByIssuer([], 3)).toEqual([])
  })
})

function holding(
  issuer: string | null,
  valueUsd: number | null,
): InsightHolding {
  return {
    address: `0x${'1'.repeat(40)}`,
    symbol: 'TKN',
    iconUrl: null,
    issuer,
    category: null,
    reviewed: true,
    abstractTokenId: null,
    balance: '1',
    decimals: 0,
    valueUsd,
    backing: {
      mintedAgainst: [],
      burnAndMint: [],
      lockedFor: [],
      unknownRole: [],
    },
  }
}
