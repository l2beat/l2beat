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

    expect(result).toEqual([
      [lastDay.add(-2, 'days'), 1, 4],
      [lastDay.add(-1, 'days'), 2, 5],
      [lastDay, 3, 6],
    ])
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

      expect(result).toEqual([
        [lastDay.add(-2, 'days'), 1, 4],
        [lastDay.add(-1, 'days'), 2, 5],
      ])
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

      expect(result).toEqual([
        [lastDay.add(-1, 'days'), 2, 5],
        [lastDay, 3, 6],
      ])
    })
  })

  describe('more layer2 data than eth data', () => {
    it('throw when eth delayed', () => {
      const apiChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 1 },
        { timestamp: lastDay.add(-1, 'days'), count: 2 },
        { timestamp: lastDay, count: 3 },
      ]

      const ethChartData: DailyTransactionCount[] = [
        { timestamp: lastDay.add(-2, 'days'), count: 4 },
        { timestamp: lastDay.add(-1, 'days'), count: 5 },
      ]

      expect(() => alignActivityData(apiChartData, ethChartData)).toThrow()
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

      expect(result).toEqual([
        [lastDay.add(-1, 'days'), 2, 5],
        [lastDay, 3, 6],
      ])
    })
  })
})
