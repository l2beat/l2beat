import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { getFirstMarketCapTimestamp } from './getTokenInfo'

// Method: replay the daily CoinGecko history WTH (Robinhood) had when it was
// added. Its first points carry a price but a market cap of -1, then 0.
const AUG_15 = UnixTime.fromDate(new Date('2026-08-15T00:00:00Z'))
const AUG_16 = AUG_15 + UnixTime.DAY
const AUG_17 = AUG_16 + UnixTime.DAY

const history = {
  prices: [point(AUG_15, 6.97), point(AUG_16, 6.99), point(AUG_17, 6.16)],
  marketCaps: [point(AUG_15, -1), point(AUG_16, 0), point(AUG_17, 1292982)],
}

describe(getFirstMarketCapTimestamp.name, () => {
  it('starts at the first real market cap', () => {
    expect(getFirstMarketCapTimestamp(history)).toEqual(AUG_17)
  })

  it('pairs market caps with the price of the same date', () => {
    const missingFirstPrice = { ...history, prices: history.prices.slice(1) }
    const realFromAug16 = {
      ...missingFirstPrice,
      marketCaps: [point(AUG_15, 1), ...history.marketCaps.slice(1)],
    }
    expect(getFirstMarketCapTimestamp(realFromAug16)).toEqual(AUG_17)
  })

  it('returns undefined when no market cap is real yet', () => {
    const unusable = { ...history, marketCaps: history.marketCaps.slice(0, 2) }
    expect(getFirstMarketCapTimestamp(unusable)).toEqual(undefined)
  })
})

function point(timestamp: UnixTime, value: number) {
  return { date: UnixTime.toDate(timestamp), value }
}
