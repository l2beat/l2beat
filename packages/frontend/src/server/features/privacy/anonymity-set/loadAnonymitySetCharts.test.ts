import type {
  PrivacyAnonymitySetEventRecord,
  PrivacyAnonymitySetSenderDayRecord,
} from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'
import { expect, mockObject } from 'earl'
import range from 'lodash/range'
import {
  ANONYMITY_SET_WINDOW_DAYS,
  calculateAnonymitySetHistory,
  calculateAnonymitySetHoldingDuration,
} from './calculateAnonymitySets'
import type { PrivacyAnonymitySetSeries } from './getPrivacyAnonymitySetSeries'
import {
  HOLDING_DURATIONS,
  loadAnonymitySetCharts,
  MAX_HOLDING_DAYS,
} from './loadAnonymitySetCharts'

const FIRST_DAY = UnixTime.fromDate(new Date('2020-01-01T00:00:00Z'))
const SPAN_DAYS = 1_000
const LAST_DAY = UnixTime(FIRST_DAY + SPAN_DAYS * UnixTime.DAY)
const ENDPOINTS = range(SPAN_DAYS + 1).map((day) =>
  UnixTime(FIRST_DAY + day * UnixTime.DAY),
)

describe(loadAnonymitySetCharts.name, () => {
  it('replays note lifecycles across chart pages and omits the holding-duration estimate', async () => {
    const series = [{ ...makeSeries('1'), unit: 'note' as const }]
    const events = range(SPAN_DAYS).flatMap((day) => {
      const timestamp = UnixTime(FIRST_DAY + day * UnixTime.DAY)
      const deposit = mockObject<PrivacyAnonymitySetEventRecord>({
        configurationId: 'configuration',
        timestamp,
        blockNumber: day * 2,
        logIndex: 0,
        amount: 1n,
        note: {
          id: day,
          active: true,
          expiresAt: UnixTime(timestamp + 31 * UnixTime.DAY),
        },
      })
      return [
        deposit,
        {
          ...deposit,
          timestamp: UnixTime(timestamp + 10 * UnixTime.DAY),
          blockNumber: (day + 10) * 2 + 1,
          amount: 0n,
          note: { id: day, active: false, expiresAt: null },
        },
      ]
    })
    const result = await loadAnonymitySetCharts(
      series,
      ENDPOINTS,
      async () => [],
      async (from, to) =>
        events.filter(
          (event) => event.timestamp >= from && event.timestamp < to,
        ),
    )
    expect(result.history).toEqual(
      calculateAnonymitySetHistory([], series, ENDPOINTS, events),
    )
    expect(result.history.at(-1)).toEqual([LAST_DAY, 10])
    expect(result.holdingDuration).toEqual([])
  })
  it('matches the unpaged calculation while bounding every fetch', async () => {
    const series = [makeSeries('1'), makeSeries('5')]
    const rows = makeRows()
    const fetches: [UnixTime, UnixTime][] = []

    const result = await loadAnonymitySetCharts(
      series,
      ENDPOINTS,
      async (from, to) => {
        fetches.push([from, to])
        return rows.filter((row) => row.timestamp >= from && row.timestamp < to)
      },
    )

    expect(result.history).toEqual(
      calculateAnonymitySetHistory(rows, series, ENDPOINTS),
    )
    expect(result.holdingDuration).toEqual(
      calculateAnonymitySetHoldingDuration(
        rows,
        series,
        LAST_DAY,
        HOLDING_DURATIONS,
      ),
    )
    expect(result.history).toHaveLength(SPAN_DAYS + 1)
    expect(result.history.some(([, ...values]) => values[0]! > 0)).toEqual(true)

    const maxFetchDays = MAX_HOLDING_DAYS + ANONYMITY_SET_WINDOW_DAYS
    expect(fetches.length).toEqual(Math.ceil(SPAN_DAYS / MAX_HOLDING_DAYS))
    for (const [from, to] of fetches) {
      expect((to - from) / UnixTime.DAY).toBeLessThanOrEqual(maxFetchDays)
    }
    expect(fetches.at(-1)).toEqual([
      UnixTime(LAST_DAY - maxFetchDays * UnixTime.DAY),
      LAST_DAY,
    ])
  })

  it('returns nothing for no endpoints', async () => {
    const result = await loadAnonymitySetCharts([], [], async () => {
      throw new Error('should not fetch')
    })

    expect(result).toEqual({ history: [], holdingDuration: [] })
  })
})

function makeSeries(minimumAmount: string): PrivacyAnonymitySetSeries {
  return {
    id: `bucket:${minimumAmount}`,
    configurationId: 'configuration',
    projectId: 'project',
    bucketId: 'bucket',
    chain: 'ethereum',
    bucketType: 'pool',
    label: `≥${minimumAmount} ETH`,
    token: 'ETH',
    formattedAmount: minimumAmount,
    minimumAmount,
    sinceTimestamp: FIRST_DAY,
  }
}

/**
 * One sender day per day with a slowly rotating sender pool, so senders recur
 * across page boundaries and both thresholds see different distinct counts.
 */
function makeRows(): PrivacyAnonymitySetSenderDayRecord[] {
  return range(SPAN_DAYS).flatMap((day) => {
    const timestamp = UnixTime(FIRST_DAY + day * UnixTime.DAY)
    return [
      {
        projectId: 'project',
        bucketId: 'bucket',
        timestamp,
        sender: `sender-${day % 41}`,
        maximumAmount: BigInt((day % 9) + 1),
      },
      {
        projectId: 'project',
        bucketId: 'bucket',
        timestamp,
        sender: `sender-${(day * 7) % 53}`,
        maximumAmount: BigInt((day % 3) + 1),
      },
    ]
  })
}
