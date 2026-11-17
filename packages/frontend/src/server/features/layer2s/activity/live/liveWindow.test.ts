import type { HourlyActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getBlockSeconds,
  getLastMinuteRates,
  getLiveWindow,
  getUsualRates,
} from './liveWindow'

// A multiple of every bucket below
const T = UnixTime(1_800_000_000)

describe(getLiveWindow.name, () => {
  it('ends with the last bucket the newest block is past', () => {
    expect(getLiveWindow('15m', T + 4, 2)).toEqual({
      from: T - 900,
      to: T - 1,
      bucket: 6,
      readFrom: T - 960,
    })
  })

  it('stretches the bucket to whole blocks', () => {
    expect(getLiveWindow('5m', T + 4, 12).bucket).toEqual(12)
    expect(getLiveWindow('1h', T + 4, 12).bucket).toEqual(24)
    expect(getLiveWindow('5m', T + 4, 0).bucket).toEqual(2)
  })

  it('keeps ten buckets in the window whatever the gap between blocks', () => {
    // Methodology: a stale block stored hours before a new one
    const window = getLiveWindow('5m', T + 4, 3 * UnixTime.HOUR)

    expect(window.bucket).toEqual(30)
    expect((window.to + 1 - window.from) / window.bucket).toEqual(10)
  })

  it('spans the whole range, read from a bucket before it', () => {
    const window = getLiveWindow('5m', T + 4, 7)

    expect(window.bucket).toEqual(7)
    expect(window.to + 1 - window.from).toEqual(300)
    expect(window.readFrom % 7).toEqual(0)
    expect(window.readFrom <= window.from - 60).toEqual(true)
  })

  it('ends where looked back to, but not past the newest block', () => {
    expect(getLiveWindow('15m', T + 4, 2, T - 3600 + 5).to).toEqual(
      T - 3600 - 1,
    )
    expect(getLiveWindow('15m', T + 4, 2, T + 600).to).toEqual(T - 1)
  })

  it('stays within the buffer as the newest block moves on', () => {
    const window = getLiveWindow('15m', T, 2, T - 5 * UnixTime.HOUR)

    expect(window.from).toEqual(T - 4 * UnixTime.HOUR)
  })
})

describe(getLastMinuteRates.name, () => {
  it('takes the rate over the minute up to the newest block', () => {
    // Methodology: the newest block is 5 s into its bucket, so the minute
    // spans the five buckets before it and 6 s of its own: 56 s
    const M = UnixTime.MINUTE
    const result = getLastMinuteRates(
      [
        { timestamp: T + 8 * M + 50, count: 1000, uopsCount: 1000 },
        { timestamp: T + 9 * M + 10, count: 280, uopsCount: 336 },
        { timestamp: T + 9 * M + 50, count: 280, uopsCount: 280 },
      ],
      T + 9 * M + 55,
    )

    expect(result).toEqual({ tps: 10, uops: 11 })
  })
})

describe(getBlockSeconds.name, () => {
  it('takes the slot past a missed one', () => {
    expect(getBlockSeconds([T, T + 12, T + 36, T + 48])).toEqual(12)
  })

  it('is a second without a gap to measure', () => {
    expect(getBlockSeconds([T])).toEqual(1)
  })
})

describe(getUsualRates.name, () => {
  const HOUR = T + 13 * UnixTime.HOUR

  it('averages the same hour of the earlier days', () => {
    const result = getUsualRates(
      [
        record(HOUR - 2 * UnixTime.DAY, 3600, 7200),
        record(HOUR - 2 * UnixTime.DAY + UnixTime.HOUR, 999_999, null),
        record(HOUR - UnixTime.DAY, 10_800, null),
      ],
      HOUR,
    )

    expect(result).toEqual({ tps: 2, uops: 2.5 })
  })

  it('has none without that hour', () => {
    expect(
      getUsualRates([record(HOUR - UnixTime.HOUR, 3600, null)], HOUR),
    ).toEqual(undefined)
  })
})

function record(
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): HourlyActivityRecord {
  return { projectId: ProjectId('base'), timestamp, count, uopsCount }
}
