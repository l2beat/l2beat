import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import type { UsualHour } from '~/server/features/layer2s/activity/live/liveWindow'
import {
  closeSteps,
  getSeam,
  getUsualRate,
  getWindowStats,
  type LiveBucket,
  toBuckets,
  toSteps,
  valueAt,
  withDashAnchor,
  withUsual,
  withWhole,
  withWholeUsual,
} from './liveSteps'

describe(toSteps.name, () => {
  const buckets: LiveBucket[] = [
    { start: 0, end: 12, value: 1, ratio: 1, blocks: 1, gas: 0 },
    { start: 12, end: 24, value: 2, ratio: 1, blocks: 1, gas: 0 },
    { start: 24, end: 36, value: 3, ratio: 1, blocks: 1, gas: 0 },
    { start: 36, end: 48, value: 4, ratio: 1, blocks: 1, gas: 0 },
  ]

  it('has a row at the start of each bucket the window is in', () => {
    // Methodology: the window starts and ends inside buckets, as one
    // scrolling with the clock does
    const steps = toSteps(buckets, [17, 29.5])

    expect(steps).toEqual([
      { timestamp: 12, end: 24, value: 2, ratio: 1, blocks: 1 },
      { timestamp: 24, end: 36, value: 3, ratio: 1, blocks: 1 },
    ])
  })

  it('keeps a wider bucket of the whole buffer that reaches into the window', () => {
    // Methodology: a 12 s bucket of the buffer, before 6 s ones of the window
    const mixed = [
      { start: 0, end: 12, value: 1, ratio: 1, blocks: 1, gas: 0 },
      { start: 12, end: 18, value: 2, ratio: 1, blocks: 1, gas: 0 },
    ]
    expect(toSteps(mixed, [8, 18]).map((s) => s.timestamp)).toEqual([0, 12])
  })

  it('leaves out the buckets that only touch the window', () => {
    expect(toSteps(buckets, [12, 36]).map((s) => s.timestamp)).toEqual([12, 24])
  })
})

describe(getSeam.name, () => {
  const read = (readFrom: number, to: number, bucket: number) => ({
    seconds: 300,
    from: UnixTime(readFrom),
    to: UnixTime(to),
    bucket,
    readFrom: UnixTime(readFrom),
  })

  it('is where the window read starts, at buckets of one width', () => {
    expect(getSeam(read(120, 240, 12), read(0, 240, 12))).toEqual(120)
  })

  it('has none at buckets of different widths', () => {
    // Methodology: the buffer still at another length's 12 s buckets after
    // the window is read at 6 s: bars of two sizes are not drawn together
    expect(getSeam(read(24, 60, 6), read(0, 48, 12))).toEqual(undefined)
    expect(getSeam(read(24, 72, 12), read(0, 48, 6))).toEqual(undefined)
  })

  it('has none when the buffer ends before the window read starts', () => {
    // Methodology: the buffer was read up to 48, and the window read has
    // since moved on to start at 60: 48 to 60 is not read
    expect(getSeam(read(60, 120, 12), read(0, 48, 12))).toEqual(undefined)
  })

  it('has none when the buffer starts no earlier', () => {
    expect(getSeam(read(0, 120, 12), read(0, 120, 12))).toEqual(undefined)
  })
})

describe(withWhole.name, () => {
  const buckets = (from: number, to: number, width: number, value: number) =>
    Array.from(
      { length: (to - from) / width },
      (_, i): LiveBucket => ({
        start: from + i * width,
        end: from + (i + 1) * width,
        value,
        ratio: 1,
        blocks: 1,
        gas: 0,
      }),
    )
  const spans = (merged: LiveBucket[]) =>
    merged.map((b) => [b.start, b.end, b.value])

  it('takes the whole buffer up to the seam and the buckets read from it', () => {
    expect(
      spans(withWhole(buckets(24, 48, 12, 2), buckets(0, 48, 12, 1), 24)),
    ).toEqual([
      [0, 12, 1],
      [12, 24, 1],
      [24, 36, 2],
      [36, 48, 2],
    ])
  })
})

describe(withWholeUsual.name, () => {
  it('adds the hours not read with the window', () => {
    const usual = withWholeUsual(
      [usualHour(7200, 5)],
      [usualHour(3600, 1), usualHour(7200, 2)],
    )

    expect(usual.map((u) => [u.hour, u.tps.median])).toEqual([
      [7200, 5],
      [3600, 1],
    ])
  })
})

describe(closeSteps.name, () => {
  const none = { usualMin: null, usualMedian: null, usualMax: null }

  it('ends the last step where its bucket ends', () => {
    // Methodology: a wider bucket of the whole buffer after the window's
    const steps = [
      { timestamp: 0, end: 6, value: 1, ratio: 1, ...none },
      { timestamp: 6, end: 18, value: 2, ratio: 1, ...none },
    ]

    expect(closeSteps(steps)).toEqual([
      ...steps,
      { timestamp: 18, end: 18, value: 2, ratio: 1, ...none },
    ])
  })

  it('ends a step before a row without a value where that row starts', () => {
    // Methodology: a bucket without blocks has a rate of zero but no ratio
    const steps = [
      { timestamp: 0, end: 12, value: 1, ratio: 1.5, ...none },
      { timestamp: 12, end: 24, value: 0, ratio: null, ...none },
      { timestamp: 24, end: 36, value: 2, ratio: 1, ...none },
    ]

    expect(closeSteps(steps).map((s) => [s.timestamp, s.ratio])).toEqual([
      [0, 1.5],
      [12, 1.5],
      [12, null],
      [24, 1],
      [36, 1],
    ])
    expect(closeSteps(steps).map((s) => s.value)).toEqual([1, 0, 0, 2, 2])
  })

  it('has nothing to close without steps', () => {
    expect(closeSteps([])).toEqual([])
  })
})

describe(toBuckets.name, () => {
  it('has every bucket, empty ones at zero and none before the oldest block', () => {
    const buckets = toBuckets(
      {
        seconds: 300,
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
      { start: 0, end: 12, value: null, ratio: null, blocks: 0, gas: 0 },
      { start: 12, end: 24, value: 3, ratio: 1.5, blocks: 2, gas: 300 },
      { start: 24, end: 36, value: 0, ratio: null, blocks: 0, gas: 0 },
      { start: 36, end: 48, value: 1, ratio: 1, blocks: 1, gas: 100 },
    ])
  })

  it('takes the count of the metric picked', () => {
    const [bucket] = toBuckets(
      {
        seconds: 300,
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
        { start: 0, end: 12, value: null, ratio: null, blocks: 0, gas: 0 },
        { start: 12, end: 24, value: 9, ratio: 1, blocks: 9, gas: 999 },
        { start: 24, end: 36, value: 3, ratio: 1, blocks: 3, gas: 360 },
        { start: 36, end: 48, value: 4, ratio: 1, blocks: 2, gas: 360 },
        { start: 48, end: 60, value: 2, ratio: 1, blocks: 1, gas: 0 },
        { start: 60, end: 72, value: 9, ratio: 1, blocks: 9, gas: 999 },
      ],
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

  it('weighs buckets of different widths by their seconds', () => {
    // Methodology: 2/s over 12 s and 5/s over 6 s: 54 in 18 s
    const result = getWindowStats(
      [
        { start: 0, end: 12, value: 2, ratio: 1, blocks: 4, gas: 0 },
        { start: 12, end: 18, value: 5, ratio: 1, blocks: 2, gas: 0 },
      ],
      [0, 18],
    )

    expect(result?.rate).toEqual(3)
    expect(result?.blocksPerMinute).toEqual(20)
  })

  it('has none before any stored block', () => {
    expect(
      getWindowStats(
        [{ start: 0, end: 12, value: null, ratio: null, blocks: 0, gas: 0 }],
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
  const step = { timestamp: 4000, end: 4012, value: 1, ratio: 1, blocks: 1 }

  it('starts with an empty step at the hour before the window', () => {
    expect(withDashAnchor([step], 4000)[0]).toEqual({
      timestamp: 3600,
      end: 3600,
      value: null,
      ratio: null,
      blocks: 0,
    })
  })

  it('takes the hour before a window starting on the hour', () => {
    expect(withDashAnchor([step], 3600)[0]?.timestamp).toEqual(0)
  })

  it('stays before a first step starting before the window', () => {
    // Methodology: a 96 s bucket from 3552 holds the window's start, 3620
    const first = { ...step, timestamp: 3552 }

    expect(withDashAnchor([first], 3620)[0]?.timestamp).toEqual(0)
  })
})
