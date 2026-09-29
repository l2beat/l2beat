import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { sampleTimeline, TIMELINE_SAMPLES } from './sampleTimeline'

describe(sampleTimeline.name, () => {
  // One grid point per day
  const from = 0
  const to = (TIMELINE_SAMPLES - 1) * UnixTime.DAY

  it('is null before the series starts and holds the last known value', () => {
    const series = [
      { timestamp: 10.5 * UnixTime.DAY, value: 5 },
      { timestamp: 20 * UnixTime.DAY, value: 7 },
    ]

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
