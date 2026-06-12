import { expect } from 'earl'
import { mergeTransferTypeStats } from './mergeTransferTypeStats'

describe('mergeTransferTypeStats', () => {
  it('returns current stats when next is undefined', () => {
    const current = {
      bus: { transferCount: 1, totalDurationSum: 60 },
    }

    expect(mergeTransferTypeStats(current, undefined)).toEqual(current)
  })

  it('merges matching transfer types and adds new ones', () => {
    expect(
      mergeTransferTypeStats(
        {
          bus: { transferCount: 1, totalDurationSum: 60 },
          taxi: { transferCount: 2, totalDurationSum: 300 },
        },
        {
          bus: { transferCount: 3, totalDurationSum: 90 },
          train: { transferCount: 1, totalDurationSum: 30 },
        },
      ),
    ).toEqual({
      bus: { transferCount: 4, totalDurationSum: 150 },
      taxi: { transferCount: 2, totalDurationSum: 300 },
      train: { transferCount: 1, totalDurationSum: 30 },
    })
  })
})
