import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { UsualHour } from '~/server/features/layer2s/activity/live/liveWindow'
import {
  getUsualRate,
  getWindowStats,
  type LiveBucket,
  toBuckets,
  toSteps,
  valueAt,
  withDashAnchor,
  withUsual,
} from './liveSteps'

describe(toSteps.name, () => {
  const buckets: LiveBucket[] = [
    { start: 0, value: 1, ratio: 1, blocks: 1, gas: 0 },
    { start: 12, value: 2, ratio: 1, blocks: 1, gas: 0 },
    { start: 24, value: 3, ratio: 1, blocks: 1, gas: 0 },
    { start: 36, value: 4, ratio: 1, blocks: 1, gas: 0 },
  ]

  it('cuts the buckets on the edges at the window', () => {
    // Methodology: the window starts and ends inside buckets, as one
    // scrolling with the clock does
    const steps = toSteps(buckets, 12, [17, 29.5])

    expect(steps.map((s) => s.timestamp)).toEqual([17, 23.999, 24, 29.499])
    expect(steps.map((s) => s.value)).toEqual([2, 2, 3, 3])
  })

  it('draws every bucket from its start to just before the next', () => {
    const steps = toSteps(buckets, 12, [0, 48])

    expect(steps.map((s) => s.timestamp)).toEqual([
      0, 11.999, 12, 23.999, 24, 35.999, 36, 47.999,
    ])
  })
})

describe(toBuckets.name, () => {
  it('has every bucket, empty ones at zero and none before the oldest block', () => {
    const buckets = toBuckets(
      {
        from: 24,
        to: 47,
        bucket: 12,
        readFrom: 0,
        points: [
          [12, 24, 36, 2, 300],
          [36, 12, 12, 1, 100],
        ],
      },
      'uops',
      12,
    )

    expect(buckets).toEqual([
      { start: 0, value: null, ratio: null, blocks: 0, gas: 0 },
      { start: 12, value: 3, ratio: 1.5, blocks: 2, gas: 300 },
      { start: 24, value: 0, ratio: null, blocks: 0, gas: 0 },
      { start: 36, value: 1, ratio: 1, blocks: 1, gas: 100 },
    ])
  })
})

describe(getWindowStats.name, () => {
  it('takes the buckets wholly in the window, none before the oldest block', () => {
    // Methodology: the window [14, 66] cuts the 12 s buckets at 12 and 60,
    // so the ones at 24, 36 and 48 count, 36 seconds in all
    const result = getWindowStats(
      [
        { start: 0, value: null, ratio: null, blocks: 0, gas: 0 },
        { start: 12, value: 9, ratio: 1, blocks: 9, gas: 999 },
        { start: 24, value: 3, ratio: 1, blocks: 3, gas: 360 },
        { start: 36, value: 4, ratio: 1, blocks: 2, gas: 360 },
        { start: 48, value: 2, ratio: 1, blocks: 1, gas: 0 },
        { start: 60, value: 9, ratio: 1, blocks: 9, gas: 999 },
      ],
      12,
      [14, 66],
    )

    expect(result).toEqual({
      from: 24,
      to: 60,
      rate: 3,
      blocksPerMinute: 10,
      gasPerSecond: 20,
    })
  })

  it('has none before any stored block', () => {
    expect(
      getWindowStats(
        [{ start: 0, value: null, ratio: null, blocks: 0, gas: 0 }],
        12,
        [0, 12],
      ),
    ).toEqual(undefined)
  })
})

describe(withUsual.name, () => {
  it('gives each step the usual range of the hour it starts in', () => {
    const steps = withUsual(
      [{ timestamp: 3599.999 }, { timestamp: 3600 }, { timestamp: 7200 }],
      [usualHour(3600, 2)],
      'tps',
    )

    expect(steps.map((s) => s.usualMedian)).toEqual([null, 2, null])
  })
})

describe(getUsualRate.name, () => {
  it('weighs each hour by how much of the window it covers', () => {
    // Methodology: a quarter of the window in the first hour
    const rate = getUsualRate(
      [usualHour(0, 4), usualHour(3600, 8)],
      'tps',
      [2700, 6300],
    )

    expect(rate).toEqual(7)
  })

  it('has none when the past week lacks an hour of the window', () => {
    expect(getUsualRate([usualHour(0, 4)], 'tps', [2700, 6300])).toEqual(
      undefined,
    )
  })

  it('has none without a usual hour in the window', () => {
    expect(getUsualRate([usualHour(0, 4)], 'tps', [3600, 4500])).toEqual(
      undefined,
    )
  })
})

describe(valueAt.name, () => {
  const steps = [
    { timestamp: 0, value: 1 },
    { timestamp: 11.999, value: 1 },
    { timestamp: 12, value: 2 },
    { timestamp: 23.999, value: 2 },
  ]

  it('reads the step a time is in', () => {
    expect(valueAt(steps, 11.9995)).toEqual(1)
    expect(valueAt(steps, 12.5)).toEqual(2)
  })

  it('has nothing before the first step', () => {
    expect(valueAt(steps, -1)).toEqual(null)
  })
})

function usualHour(hour: number, median: number): UsualHour {
  const range = { median, min: median, max: median }
  return { hour: UnixTime(hour), tps: range, uops: range }
}

describe(withDashAnchor.name, () => {
  const step = { timestamp: 4000, value: 1, ratio: 1, blocks: 1 }

  it('starts with an empty step at the hour before the window', () => {
    expect(withDashAnchor([step], 4000)[0]).toEqual({
      timestamp: 3600,
      value: null,
      ratio: null,
      blocks: 0,
    })
  })

  it('takes the hour before a window starting on the hour', () => {
    expect(withDashAnchor([step], 3600)[0]?.timestamp).toEqual(0)
  })
})
