import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { UsualHour } from '~/server/features/layer2s/activity/live/liveWindow'
import {
  closeSteps,
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

  it('has a row at the start of each bucket the window is in', () => {
    // Methodology: the window starts and ends inside buckets, as one
    // scrolling with the clock does
    const steps = toSteps(buckets, 12, [17, 29.5])

    expect(steps).toEqual([
      { timestamp: 12, value: 2, ratio: 1, blocks: 1 },
      { timestamp: 24, value: 3, ratio: 1, blocks: 1 },
    ])
  })

  it('leaves out the buckets that only touch the window', () => {
    expect(toSteps(buckets, 12, [12, 36]).map((s) => s.timestamp)).toEqual([
      12, 24,
    ])
  })
})

describe(closeSteps.name, () => {
  const none = { usualMin: null, usualMedian: null, usualMax: null }

  it('ends the last step a bucket after it starts', () => {
    const steps = [
      { timestamp: 0, value: 1, ratio: 1, ...none },
      { timestamp: 12, value: 2, ratio: 1, ...none },
    ]

    expect(closeSteps(steps, 12)).toEqual([
      ...steps,
      { timestamp: 24, value: 2, ratio: 1, ...none },
    ])
  })

  it('ends a step before a row without a value where that row starts', () => {
    // Methodology: a bucket without blocks has a rate of zero but no ratio
    const steps = [
      { timestamp: 0, value: 1, ratio: 1.5, ...none },
      { timestamp: 12, value: 0, ratio: null, ...none },
      { timestamp: 24, value: 2, ratio: 1, ...none },
    ]

    expect(closeSteps(steps, 12).map((s) => [s.timestamp, s.ratio])).toEqual([
      [0, 1.5],
      [12, 1.5],
      [12, null],
      [24, 1],
      [36, 1],
    ])
    expect(closeSteps(steps, 12).map((s) => s.value)).toEqual([1, 0, 0, 2, 2])
  })

  it('has nothing to close without steps', () => {
    expect(closeSteps([], 12)).toEqual([])
  })
})

describe(toBuckets.name, () => {
  it('has every bucket, empty ones at zero and none before the oldest block', () => {
    const buckets = toBuckets(
      {
        range: '5m',
        from: UnixTime(24),
        to: UnixTime(48),
        bucket: 12,
        readFrom: UnixTime(0),
      },
      [
        {
          timestamp: UnixTime(12),
          count: 24,
          uopsCount: 36,
          blocks: 2,
          gasUsed: 300,
        },
        {
          timestamp: UnixTime(36),
          count: 12,
          uopsCount: 12,
          blocks: 1,
          gasUsed: 100,
        },
      ],
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

  it('takes the count of the metric picked', () => {
    const [bucket] = toBuckets(
      {
        range: '5m',
        from: UnixTime(0),
        to: UnixTime(12),
        bucket: 12,
        readFrom: UnixTime(0),
      },
      [
        {
          timestamp: UnixTime(0),
          count: 24,
          uopsCount: 36,
          blocks: 2,
          gasUsed: 300,
        },
      ],
      'gas',
      0,
    )

    expect(bucket?.value).toEqual(25)
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
      blocks: 6,
      gas: 720,
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
      [{ timestamp: 3594 }, { timestamp: 3600 }, { timestamp: 7200 }],
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
    { timestamp: 12, value: 1 },
    { timestamp: 12, value: 2 },
    { timestamp: 24, value: 2 },
  ]

  it('reads the step a time is in', () => {
    expect(valueAt(steps, 11.5)).toEqual(1)
    expect(valueAt(steps, 12)).toEqual(2)
    expect(valueAt(steps, 30)).toEqual(2)
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

  it('stays before a first step starting before the window', () => {
    // Methodology: a 96 s bucket from 3552 holds the window's start, 3700
    const first = { ...step, timestamp: 3552 }

    expect(withDashAnchor([first], 3700)[0]?.timestamp).toEqual(0)
  })
})
