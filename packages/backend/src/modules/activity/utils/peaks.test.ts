import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { continueMinute, getDayPeaks } from './peaks'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(continueMinute.name, () => {
  it('adds the part of the first minute that the previous batch counted', () => {
    const result = continueMinute(
      [sum(START, 2, 3, 3), sum(START + 60, 6, 4, 4)],
      sum(START, 5, 1, 2),
    )

    expect(result).toEqual([sum(START, 7, 1, 3), sum(START + 60, 6, 4, 4)])
  })

  it('ignores a previous minute that the batch does not start in', () => {
    const minutes = [sum(START + 60, 2, 3, 3)]

    expect(continueMinute(minutes, sum(START, 50, 1, 2))).toEqual(minutes)
  })
})

describe(getDayPeaks.name, () => {
  it('finds the busiest hour and minute of the day, of txs and of uops each', () => {
    const peaks = getDayPeaks(
      START,
      [
        counts(START, 10, 12),
        counts(START + 1 * UnixTime.HOUR, 15, 11),
        counts(START + 1 * UnixTime.DAY, 99, 99),
      ],
      [
        counts(START + 60, 3, 4),
        counts(START + 120, 2, 9),
        counts(START + 1 * UnixTime.DAY, 99, 99),
      ],
    )

    expect(peaks).toEqual({
      peakHourCount: 15,
      peakHourUopsCount: 12,
      peakMinuteCount: 3,
      peakMinuteUopsCount: 9,
    })
  })

  it('has no uops peaks for a chain without uops', () => {
    const peaks = getDayPeaks(
      START,
      [counts(START, 10, null)],
      [counts(START, 3, null)],
    )

    expect(peaks).toEqual({
      peakHourCount: 10,
      peakHourUopsCount: null,
      peakMinuteCount: 3,
      peakMinuteUopsCount: null,
    })
  })
})

/** Uops follow txs */
function sum(timestamp: UnixTime, count: number, start: number, end: number) {
  return { timestamp, count, uopsCount: count, start, end }
}

function counts(timestamp: UnixTime, count: number, uopsCount: number | null) {
  return { timestamp, count, uopsCount }
}
