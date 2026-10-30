import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'
import { sumPerPeriod } from './sumPerPeriod'

const START = UnixTime.fromDate(new Date('2021-01-01T00:00:00Z'))

describe(sumPerPeriod.name, () => {
  it('sums the counts of the blocks in each period', () => {
    const result = sumPerPeriod(
      [
        block(START, 1, 1, 1),
        block(START + 1 * UnixTime.HOUR, 5, 8, 2),
        block(START + 2 * UnixTime.HOUR, 2, 3, 3),
        block(START + 1 * UnixTime.DAY, 2, 2, 4),
        block(START + 1 * UnixTime.DAY + 1 * UnixTime.HOUR, 6, 7, 5),
      ],
      'day',
    )

    expect(result).toEqual([
      { timestamp: START, count: 8, uopsCount: 12, start: 1, end: 3 },
      {
        timestamp: START + 1 * UnixTime.DAY,
        count: 8,
        uopsCount: 9,
        start: 4,
        end: 5,
      },
    ])
  })

  it('adds nothing for a block without a uops count', () => {
    const result = sumPerPeriod(
      [
        block(START, 1, null, 1),
        block(START + 10, 2, 5, 2),
        block(START + 20, 3, null, 3),
      ],
      'minute',
    )

    expect(result).toEqual([
      { timestamp: START, count: 6, uopsCount: 5, start: 1, end: 3 },
    ])
  })
})

function block(
  timestamp: UnixTime,
  txsCount: number,
  uopsCount: number | null,
  number: number,
) {
  return { timestamp, txsCount, uopsCount, number }
}
