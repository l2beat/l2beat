import { ActivityApiChart, UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { alignActivityData } from './createApi'

const lastDay = UnixTime.now().toStartOf('day')

describe(alignActivityData.name, () => {
  it('should return the correct chart', () => {
    const apiChartData: ActivityApiChart['data'] = [
      [lastDay.add(-2, 'days'), 1],
      [lastDay.add(-1, 'days'), 2],
      [lastDay, 3],
    ]

    const ethChartData: ActivityApiChart['data'] = [
      [lastDay.add(-2, 'days'), 4],
      [lastDay.add(-1, 'days'), 5],
      [lastDay, 6],
    ]

    const result = alignActivityData(apiChartData, ethChartData)

    expect(result).toEqual([
      [lastDay.add(-2, 'days').toNumber(), 1, 4],
      [lastDay.add(-1, 'days').toNumber(), 2, 5],
      [lastDay.toNumber(), 3, 6],
    ])
  })

  describe('more eth data than layer2 data', () => {
    it('cut front', () => {
      const apiChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 1],
        [lastDay.add(-1, 'days'), 2],
      ]

      const ethChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 4],
        [lastDay.add(-1, 'days'), 5],
        [lastDay, 6],
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual([
        [lastDay.add(-2, 'days').toNumber(), 1, 4],
        [lastDay.add(-1, 'days').toNumber(), 2, 5],
      ])
    })

    it('cut back', () => {
      const apiChartData: ActivityApiChart['data'] = [
        [lastDay.add(-1, 'days'), 2],
        [lastDay, 3],
      ]

      const ethChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 4],
        [lastDay.add(-1, 'days'), 5],
        [lastDay, 6],
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual([
        [lastDay.add(-1, 'days').toNumber(), 2, 5],
        [lastDay.toNumber(), 3, 6],
      ])
    })
  })

  describe('more layer2 data than eth data', () => {
    it('throw when eth delayed', () => {
      const apiChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 1],
        [lastDay.add(-1, 'days'), 2],
        [lastDay, 3],
      ]

      const ethChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 4],
        [lastDay.add(-1, 'days'), 5],
      ]

      expect(() => alignActivityData(apiChartData, ethChartData)).toThrow()
    })

    it('cut back', () => {
      const apiChartData: ActivityApiChart['data'] = [
        [lastDay.add(-2, 'days'), 1],
        [lastDay.add(-1, 'days'), 2],
        [lastDay, 3],
      ]

      const ethChartData: ActivityApiChart['data'] = [
        [lastDay.add(-1, 'days'), 5],
        [lastDay, 6],
      ]

      const result = alignActivityData(apiChartData, ethChartData)

      expect(result).toEqual([
        [lastDay.add(-1, 'days').toNumber(), 2, 5],
        [lastDay.toNumber(), 3, 6],
      ])
    })
  })
})
