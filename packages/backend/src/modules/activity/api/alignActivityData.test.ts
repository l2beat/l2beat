import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { alignActivityData } from './alignActivityData'
import { DailyTransactionCount } from './types'

const lastDay = UnixTime.now().toStartOf('day')

describe(alignActivityData.name, () => {
  it('should return the correct chart', () => {
    const apiChartData: DailyTransactionCount[] = [
      { timestamp: lastDay.add(-2, 'days'), count: 1 },
      { timestamp: lastDay.add(-1, 'days'), count: 2 },
      { timestamp: lastDay, count: 3 },
    ]

    const ethChartData: DailyTransactionCount[] = [
      { timestamp: lastDay.add(-2, 'days'), count: 4 },
      { timestamp: lastDay.add(-1, 'days'), count: 5 },
      { timestamp: lastDay, count: 6 },
    ]

    const result = alignActivityData(apiChartData, ethChartData)

    expect(result).toEqual({
      type: 'success',
      data: [
        [lastDay.add(-2, 'days'), 1, 4],
        [lastDay.add(-1, 'days'), 2, 5],
        [lastDay, 3, 6],
      ],
    })
  })

  it('should return error when no data in activity chart', () => {
    const result = alignActivityData(
      [],
      [
        { timestamp: lastDay.add(-2, 'days'), count: 4 },
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
        { timestamp: lastDay, count: 6 },
      ],
    )

    expect(result).toEqual({
      type: 'error',
      error: 'DATA_NOT_SYNCED',
    })
  })

  describe('more eth data than layer2 data', () => {
    it('cut front', () => {
      const apiChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 1 },
        { timestamp: lastDay.add(-1, 'days'), count: 2 },
      ]

      const ethChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 4 },
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
        { timestamp: lastDay, count: 6 },
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual({
        type: 'success',
        data: [
          [lastDay.add(-2, 'days'), 1, 4],
          [lastDay.add(-1, 'days'), 2, 5],
        ],
      })
    })

    it('cut back', () => {
      const apiChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-1, 'days'), count: 2 },
        { timestamp: lastDay, count: 3 },
      ]

      const ethChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 4 },
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
        { timestamp: lastDay, count: 6 },
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual({
        type: 'success',
        data: [
          [lastDay.add(-1, 'days'), 2, 5],
          [lastDay, 3, 6],
        ],
      })
    })
  })

  describe('more layer2 data than eth data', () => {
    it('returns error when eth delayed', () => {
      const apiChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 1 },
        { timestamp: lastDay.add(-1, 'days'), count: 2 },
        { timestamp: lastDay, count: 3 },
      ]

      const ethChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 4 },
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual({
        type: 'error',
        error: 'ETHEREUM_DATA_DELAYED',
      })
    })

    it('cut back', () => {
      const apiChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 1 },
        { timestamp: lastDay.add(-1, 'days'), count: 2 },
        { timestamp: lastDay, count: 3 },
      ]

      const ethChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
        { timestamp: lastDay, count: 6 },
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual({
        type: 'success',
        data: [
          [lastDay.add(-1, 'days'), 2, 5],
          [lastDay, 3, 6],
        ],
      })
    })
  })
})
