import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { toDailySupply } from './getEthSupply'

describe(toDailySupply.name, () => {
  const day = (iso: string) => new Date(iso)

  it('keeps the midnight point of each day as market cap over price', () => {
    const prices = [
      { date: day('2026-11-18T00:00:00Z'), value: 2 },
      { date: day('2026-11-19T00:00:00Z'), value: 4 },
      { date: day('2026-11-19T12:13:51Z'), value: 5 },
    ]
    const marketCaps = [
      { date: day('2026-11-18T00:00:00Z'), value: 200 },
      { date: day('2026-11-19T00:00:00Z'), value: 404 },
      { date: day('2026-11-19T12:13:51Z'), value: 510 },
    ]

    expect(toDailySupply(prices, marketCaps)).toEqual([
      { timestamp: UnixTime.fromDate(day('2026-11-18T00:00:00Z')), value: 100 },
      { timestamp: UnixTime.fromDate(day('2026-11-19T00:00:00Z')), value: 101 },
    ])
  })

  it('skips points without a price or a market cap', () => {
    const prices = [{ date: day('2026-11-18T00:00:00Z'), value: 0 }]
    const marketCaps = [{ date: day('2026-11-18T00:00:00Z'), value: 200 }]

    expect(toDailySupply(prices, marketCaps)).toEqual([])
  })
})
