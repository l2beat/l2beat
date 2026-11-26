import type { HourlyActivityRecord } from '@l2beat/database'
import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import { expect, mockFn } from 'earl'
import {
  getBlockSeconds,
  getLastMinuteRates,
  getLiveBuffer,
  getLiveWindow,
  getUsualRates,
  isLiveFresh,
  LEAD_SECONDS,
} from './liveWindow'

// A multiple of every bucket below
const T = UnixTime(1_800_000_000)

describe(isLiveFresh.name, () => {
  it('is fresh while the newest block is at most half an hour old', () => {
    expect(isLiveFresh(T - 29 * UnixTime.MINUTE, T)).toEqual(true)
    expect(isLiveFresh(T - 30 * UnixTime.MINUTE, T)).toEqual(true)
  })

  it('is not once the newest block is older, or there is none', () => {
    expect(isLiveFresh(T - 31 * UnixTime.MINUTE, T)).toEqual(false)
    expect(isLiveFresh(undefined, T)).toEqual(false)
  })
})

describe(getLiveBuffer.name, () => {
  it('spans what is kept, from a whole minute', () => {
    expect(getLiveBuffer(T + 70, T - 5 * UnixTime.HOUR)).toEqual({
      from: T - 4 * UnixTime.HOUR + 60,
      to: T + 70,
      filling: false,
    })
  })

  it('starts at the oldest block while filling', () => {
    expect(getLiveBuffer(T + 70, T - UnixTime.HOUR + 5)).toEqual({
      from: T - UnixTime.HOUR,
      to: T + 70,
      filling: true,
    })
  })

  it('is not filling when just under what is kept', () => {
    // Methodology: the cleaner has just run and the newest block trails it
    expect(
      getLiveBuffer(T, T - 4 * UnixTime.HOUR + 10 * UnixTime.MINUTE).filling,
    ).toEqual(false)
  })

  it('is at least a minute long', () => {
    expect(getLiveBuffer(T + 70, T + 65).from).toEqual(T + 10)
    expect(getLiveBuffer(T + 70, undefined).from).toEqual(T + 10)
  })
})

describe(getLiveWindow.name, () => {
  const buffer = { from: T - 4 * UnixTime.HOUR, to: T + 4 }

  it('ends with the last bucket the newest block is past', () => {
    expect(getLiveWindow(900, buffer, 2)).toEqual({
      seconds: 900,
      from: T - 900,
      to: T,
      bucket: 6,
      // the lead is a multiple of the bucket
      readFrom: T - 900 - LEAD_SECONDS,
    })
  })

  it('stretches the bucket to whole blocks', () => {
    expect(getLiveWindow(300, buffer, 12).bucket).toEqual(12)
    expect(getLiveWindow(3600, buffer, 12).bucket).toEqual(24)
    expect(getLiveWindow(300, buffer, 0).bucket).toEqual(2)
  })

  it('sizes the bucket of any length to about 1/150 of it', () => {
    // Methodology: 7 min / 150 = 2.8 s, rounded up to a second or a block
    expect(getLiveWindow(420, buffer, 1).bucket).toEqual(3)
    expect(getLiveWindow(420, buffer, 2).bucket).toEqual(4)
    const window = getLiveWindow(420, buffer, 2)
    expect(window.to - window.from).toEqual(420)
  })

  it('keeps ten buckets in the window whatever the gap between blocks', () => {
    // Methodology: a stale block stored hours before a new one
    const window = getLiveWindow(300, buffer, 3 * UnixTime.HOUR)

    expect(window.bucket).toEqual(30)
    expect((window.to - window.from) / window.bucket).toEqual(10)
  })

  it('spans the whole range, read from a bucket before it', () => {
    const window = getLiveWindow(300, buffer, 7)

    expect(window.bucket).toEqual(7)
    expect(window.to - window.from).toEqual(300)
    expect(window.readFrom % 7).toEqual(0)
    expect(window.readFrom <= window.from - LEAD_SECONDS).toEqual(true)
  })

  it('ends at the newest block while the buffer is shorter than the range', () => {
    const filling = { from: T - 600, to: T + 4 }

    expect(getLiveWindow(3600, filling, 2).to).toEqual(T)
  })

  it('reads the whole buffer at the same bucket', () => {
    expect(getLiveWindow(900, buffer, 2, true)).toEqual({
      ...getLiveWindow(900, buffer, 2),
      readFrom: buffer.from,
    })
  })

  it('reads the whole of a buffer shorter than the range from before the window', () => {
    const filling = { from: T - 600, to: T + 4 }

    expect(getLiveWindow(3600, filling, 2, true).readFrom).toEqual(
      getLiveWindow(3600, filling, 2).readFrom,
    )
  })
})

describe(getLastMinuteRates.name, () => {
  it('takes the rate over the minute up to the newest block', async () => {
    // Methodology: the newest block is 5 s into a tenth second, so the minute
    // spans the 50 s before that and 6 s after: 56 s
    const M = UnixTime.MINUTE
    const getBuckets = mockFn().resolvesTo([
      { count: 280, uopsCount: 336 },
      { count: 280, uopsCount: 280 },
    ])

    const result = await getLastMinuteRates(T + 9 * M + 55, getBuckets)

    expect(result).toEqual({ tps: 10, uops: 11 })
    expect(getBuckets).toHaveBeenOnlyCalledWith(T + 9 * M, T + 9 * M + 55)
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

  it('takes the median and range of the same hour on the earlier days', () => {
    // Methodology: one busy day, which would pull an average up
    const result = getUsualRates(
      [
        record(HOUR - 3 * UnixTime.DAY, 3600, 7200),
        record(HOUR - 2 * UnixTime.DAY, 7200, null),
        record(HOUR - 2 * UnixTime.DAY + UnixTime.HOUR, 999_999, null),
        record(HOUR - UnixTime.DAY, 36_000, null),
      ],
      HOUR,
      HOUR,
    )

    expect(result).toEqual([
      {
        hour: HOUR,
        tps: { median: 2, min: 1, max: 10 },
        uops: { median: 2, min: 2, max: 10 },
      },
    ])
  })

  it('averages the middle two of an even number of days', () => {
    const [usual] = getUsualRates(
      [
        record(HOUR - 2 * UnixTime.DAY, 3600, null),
        record(HOUR - UnixTime.DAY, 10_800, null),
      ],
      HOUR,
      HOUR,
    )

    expect(usual?.tps.median).toEqual(2)
  })

  it('has every hour the window is in, but none without a day of it', () => {
    const result = getUsualRates(
      [
        record(HOUR - UnixTime.DAY, 3600, null),
        record(HOUR - UnixTime.DAY + 2 * UnixTime.HOUR, 7200, null),
      ],
      HOUR,
      HOUR + 2 * UnixTime.HOUR,
    )

    expect(result.map((u) => [u.hour, u.tps.median])).toEqual([
      [HOUR, 1],
      [HOUR + 2 * UnixTime.HOUR, 2],
    ])
  })
})

function record(
  timestamp: UnixTime,
  count: number,
  uopsCount: number | null,
): HourlyActivityRecord {
  return { projectId: ProjectId('base'), timestamp, count, uopsCount }
}
