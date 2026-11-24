import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { EthSupplyDay } from '~/server/features/eth-supply/types'
import { getFlowRows, sliceRange, summarize } from './economics'

const DAY = UnixTime.DAY
const START = UnixTime.fromDate(new Date('2025-01-01T00:00:00Z'))

describe(sliceRange.name, () => {
  it('keeps the last days of the range, the latest included', () => {
    const days = makeDays(40)

    expect(sliceRange(days, '30d').map((d) => d.timestamp)).toEqual(
      days.slice(10).map((d) => d.timestamp),
    )
    expect(sliceRange(days, 'all')).toEqual(days)
  })
})

describe(summarize.name, () => {
  it('annualises the net over the supply the window started with', () => {
    // 3 days at 10 issued and 5 burned, ending at 1,015 from 1,000
    const summary = summarize(
      makeDays(3, { start: 1_000, issued: 10, burned: 5 }),
    )

    expect(summary).toEqual({
      days: 3,
      issued: 30,
      burned: 15,
      net: 15,
      annualizedRate: (15 / 1_000) * (365 / 3),
      burnOffset: 0.5,
    })
  })
})

describe(getFlowRows.name, () => {
  it('averages weeks beyond 120 days, with the leftover days first', () => {
    const rows = getFlowRows(makeDays(130, { start: 0, issued: 7, burned: 1 }))

    expect(rows.length).toEqual(19)
    expect(rows[0]).toEqual({
      timestamp: START,
      until: START + 3 * DAY,
      days: 4,
      issuance: 7,
      burn: 1,
      net: 6,
    })
    expect(rows.at(-1)?.until).toEqual(START + 129 * DAY)
  })

  it('keeps single days up to 120 days', () => {
    expect(getFlowRows(makeDays(120)).length).toEqual(120)
  })
})

function makeDays(
  count: number,
  { start = 1_000, issued = 2, burned = 1 } = {},
): EthSupplyDay[] {
  return Array.from({ length: count }, (_, i) => ({
    timestamp: START + i * DAY,
    totalSupply: start + (i + 1) * (issued - burned),
    issuance: issued,
    burn: burned,
    ethPriceUsd: null,
  }))
}
