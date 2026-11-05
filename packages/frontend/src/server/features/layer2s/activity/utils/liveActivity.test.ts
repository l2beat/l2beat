import type { HourlyActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getLiveActivityRates,
  getLiveActivitySyncWarning,
  getLiveHourlyPoints,
} from './liveActivity'

const HOUR = UnixTime.HOUR
const MINUTE = UnixTime.MINUTE
const at = (iso: string) => UnixTime.fromDate(new Date(iso))

// Methodology: the latest block is at 14:03, three minutes into its hour, so
// the window is the 23 full hours before 14:00 and the 14:00 hour so far
const H = at('2026-11-05T14:00:00Z')
const T = H + 3 * MINUTE

describe(getLiveActivityRates.name, () => {
  it('averages over the 23 full hours and the hour so far', () => {
    const rates = getLiveActivityRates({
      latestBlockTimestamp: T,
      records: [
        // A day before the hour so far: outside the window
        hour(H - 24 * HOUR, 1_000_000, 1_000_000),
        hour(H - 23 * HOUR, 100, 150),
        hour(H - 1 * HOUR, 200, null),
        hour(H, 30, 40),
      ],
    })

    const seconds = 23 * HOUR + 3 * MINUTE
    expect(rates).toEqual({
      asOf: T,
      tps: 330 / seconds,
      // Hours without uops count their transactions
      uops: 390 / seconds,
    })
  })

  it('averages over the 23 full hours alone when the latest block starts its hour', () => {
    const rates = getLiveActivityRates({
      latestBlockTimestamp: H,
      records: [hour(H - 1 * HOUR, 23 * HOUR, 23 * HOUR)],
    })

    expect(rates.tps).toEqual(1)
  })
})

describe(getLiveActivitySyncWarning.name, () => {
  it('stays quiet while the counts follow finality', () => {
    expect(getLiveActivitySyncWarning(T, T + 20 * MINUTE)).toEqual(undefined)
  })

  it('warns when finality or the indexer has stalled', () => {
    expect(getLiveActivitySyncWarning(T, T + 2 * HOUR)).toEqual(
      'No activity data since 5 Nov 2026, 14:03 UTC.',
    )
  })
})

describe(getLiveHourlyPoints.name, () => {
  it('fills full hours without blocks and ends with the hour so far', () => {
    const result = getLiveHourlyPoints(
      {
        latestBlockTimestamp: T,
        records: [hour(H - 2 * HOUR, 5, 6), hour(H, 3, 4)],
      },
      H - 2 * HOUR,
    )

    expect(result).toEqual({
      points: [
        [H - 2 * HOUR, 5, 6],
        [H - 1 * HOUR, 0, 0],
        [H, 3, 4],
      ],
      partialHour: { from: H, until: T },
    })
  })

  it('ends with the last full hour when the latest block starts its hour', () => {
    // An hour so far of no length has no rate
    const result = getLiveHourlyPoints(
      { latestBlockTimestamp: H, records: [hour(H - 1 * HOUR, 5, 6)] },
      H - 1 * HOUR,
    )

    expect(result).toEqual({
      points: [[H - 1 * HOUR, 5, 6]],
      partialHour: undefined,
    })
  })
})

function hour(
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): HourlyActivityRecord {
  return { projectId: ProjectId.ETHEREUM, timestamp, count, uopsCount }
}
