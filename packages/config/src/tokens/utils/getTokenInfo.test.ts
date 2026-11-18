import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getFirstUsableCoingeckoTimestamp } from './getTokenInfo'

// Method: replay the daily CoinGecko history WTH (Robinhood) had when it was
// added. Its first points carry a price but a market cap of -1, then 0.
describe(getFirstUsableCoingeckoTimestamp.name, () => {
  const AUG_15 = UnixTime.fromDate(new Date('2026-08-15T00:00:00Z'))
  const AUG_16 = AUG_15 + UnixTime.DAY
  const AUG_17 = AUG_16 + UnixTime.DAY

  const history = {
    prices: [point(AUG_15, 6.97), point(AUG_16, 6.99), point(AUG_17, 6.16)],
    marketCaps: [point(AUG_15, -1), point(AUG_16, 0), point(AUG_17, 1292982)],
  }

  it('starts a circulating supply token at its first real market cap', () => {
    expect(
      getFirstUsableCoingeckoTimestamp(history, 'circulatingSupply'),
    ).toEqual(AUG_17)
  })

  it('starts other tokens at their first price', () => {
    expect(getFirstUsableCoingeckoTimestamp(history, 'totalSupply')).toEqual(
      AUG_15,
    )
  })

  it('returns undefined when no market cap is real yet', () => {
    const unusable = { ...history, marketCaps: history.marketCaps.slice(0, 2) }
    expect(
      getFirstUsableCoingeckoTimestamp(unusable, 'circulatingSupply'),
    ).toEqual(undefined)
  })
})

function point(timestamp: UnixTime, value: number) {
  return { date: UnixTime.toDate(timestamp), value }
}
