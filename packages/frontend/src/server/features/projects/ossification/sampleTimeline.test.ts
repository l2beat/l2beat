import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import {
  getTimelinePeak,
  sampleTimeline,
  TIMELINE_SAMPLES,
} from './sampleTimeline'

describe(sampleTimeline.name, () => {
  // One grid point per day
  const from = 0
  const to = (TIMELINE_SAMPLES - 1) * UnixTime.DAY

  it('is null before the series starts and holds the last known value', () => {
    const series = [
      { timestamp: 10.5 * UnixTime.DAY, value: 5 },
      { timestamp: 20 * UnixTime.DAY, value: 7 },
    ]

    // Days 0-10 precede the first sample, days 11-19 hold 5, the rest hold 7
    expect(sampleTimeline(series, from, to)).toEqual([
      ...Array(11).fill(null),
      ...Array(9).fill(5),
      ...Array(TIMELINE_SAMPLES - 20).fill(7),
    ])
  })

  it('returns null for an empty series', () => {
    expect(sampleTimeline([], from, to)).toEqual(null)
  })
})

describe(getTimelinePeak.name, () => {
  const from = 0
  const to = (TIMELINE_SAMPLES - 1) * UnixTime.DAY

  it('counts a spike between samples and the value held at the start', () => {
    const series = [
      { timestamp: -UnixTime.DAY, value: 8 },
      { timestamp: 3.5 * UnixTime.DAY, value: 20 },
      { timestamp: 4 * UnixTime.DAY, value: 5 },
    ]

    expect(sampleTimeline(series, from, to)?.includes(20)).toEqual(false)
    expect(getTimelinePeak(series, from, to)).toEqual(20)
    expect(getTimelinePeak(series.slice(0, 1), from, to)).toEqual(8)
  })

  it('returns null for an empty series', () => {
    expect(getTimelinePeak([], from, to)).toEqual(null)
  })
})
