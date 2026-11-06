import { expect } from 'earl'
import {
  getWindowStats,
  type LiveBucket,
  toBuckets,
  toSteps,
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

    expect(result).toEqual({ rate: 3, blocksPerMinute: 10, gasPerSecond: 20 })
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
