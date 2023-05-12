import { ActivityApiChart, UnixTime } from '@l2beat/shared'
import { expect } from 'earl'

import { getActivityChart } from './createApi'

const lastDay = UnixTime.now().toStartOf('day')

describe(getActivityChart.name, () => {
  it('should return the correct chart', () => {
    const apiChart: ActivityApiChart = {
      types: ['timestamp', 'daily tx count'],
      data: [
        [lastDay.add(-2, 'days'), 1],
        [lastDay.add(-1, 'days'), 2],
        [lastDay, 3],
      ],
    }

    const ethChart: ActivityApiChart = {
      types: ['timestamp', 'daily tx count'],
      data: [
        [lastDay.add(-2, 'days'), 4],
        [lastDay.add(-1, 'days'), 5],
        [lastDay, 6],
      ],
    }

    const result = getActivityChart(apiChart, ethChart)

    expect(result).toEqual({
      daily: {
        types: ['timestamp', 'transactions', 'ethereumTransactions'],
        data: [
          [lastDay.add(-2, 'days').toNumber(), 1, 4],
          [lastDay.add(-1, 'days').toNumber(), 2, 5],
          [lastDay.toNumber(), 3, 6],
        ],
      },
    })
  })

  describe('should align eth chart to api chart', () => {
    it('cut front', () => {
      const apiChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 1],
          [lastDay.add(-1, 'days'), 2],
        ],
      }

      const ethChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 4],
          [lastDay.add(-1, 'days'), 5],
          [lastDay, 6],
        ],
      }

      const result = getActivityChart(apiChart, ethChart)

      expect(result).toEqual({
        daily: {
          types: ['timestamp', 'transactions', 'ethereumTransactions'],
          data: [
            [lastDay.add(-2, 'days').toNumber(), 1, 4],
            [lastDay.add(-1, 'days').toNumber(), 2, 5],
          ],
        },
      })
    })

    it('cut back', () => {
      const apiChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-1, 'days'), 2],
          [lastDay, 3],
        ],
      }

      const ethChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 4],
          [lastDay.add(-1, 'days'), 5],
          [lastDay, 6],
        ],
      }

      const result = getActivityChart(apiChart, ethChart)

      expect(result).toEqual({
        daily: {
          types: ['timestamp', 'transactions', 'ethereumTransactions'],
          data: [
            [lastDay.add(-1, 'days').toNumber(), 2, 5],
            [lastDay.toNumber(), 3, 6],
          ],
        },
      })
    })
  })

  describe('if eth data is not present', () => {
    it('throw when eth delayed', () => {
      const apiChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 1],
          [lastDay.add(-1, 'days'), 2],
          [lastDay, 3],
        ],
      }

      const ethChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 4],
          [lastDay.add(-1, 'days'), 5],
        ],
      }

      expect(() => getActivityChart(apiChart, ethChart)).toThrow()
    })

    it('cut back', () => {
      const apiChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-2, 'days'), 1],
          [lastDay.add(-1, 'days'), 2],
          [lastDay, 3],
        ],
      }

      const ethChart: ActivityApiChart = {
        types: ['timestamp', 'daily tx count'],
        data: [
          [lastDay.add(-1, 'days'), 5],
          [lastDay, 6],
        ],
      }

      const result = getActivityChart(apiChart, ethChart)

      expect(result).toEqual({
        daily: {
          types: ['timestamp', 'transactions', 'ethereumTransactions'],
          data: [
            [lastDay.add(-1, 'days').toNumber(), 2, 5],
            [lastDay.toNumber(), 3, 6],
          ],
        },
      })
    })
  })
})
