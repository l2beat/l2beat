import { UnixTime } from '@l2beat/shared-pure'
import { expect } from 'earl'

import { postprocessCounts } from './postprocessCounts'

const startOfDay = UnixTime.now().toStartOf('day')

describe(postprocessCounts.name, () => {
  describe('still processing', () => {
    it('fills missing with 0s and removes last', () => {
      const result = postprocessCounts(
        [
          {
            count: 1,
            timestamp: startOfDay.add(-6, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-3, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-1, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay,
          },
        ],
        false,
        startOfDay.add(1, 'hours'),
      )

      expect(result).toEqual([
        {
          count: 1,
          timestamp: startOfDay.add(-6, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-5, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-4, 'days'),
        },
        {
          count: 1,
          timestamp: startOfDay.add(-3, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-2, 'days'),
        },
        {
          count: 1,
          timestamp: startOfDay.add(-1, 'days'),
        },
      ])
    })

    it('does not add zeroes after last', () => {
      const result = postprocessCounts(
        [
          {
            count: 1,
            timestamp: startOfDay.add(-6, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-3, 'days'),
          },
        ],
        false,
        startOfDay.add(1, 'hours'),
      )

      expect(result).toEqual([
        {
          count: 1,
          timestamp: startOfDay.add(-6, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-5, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-4, 'days'),
        },
      ])
    })
  })

  describe('all processed', () => {
    it('fills missing with 0s if yesterday processed', () => {
      const result = postprocessCounts(
        [
          {
            count: 1,
            timestamp: startOfDay.add(-6, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-3, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-1, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay,
          },
        ],
        true,
        startOfDay.add(1, 'hours'),
      )

      expect(result).toEqual([
        {
          count: 1,
          timestamp: startOfDay.add(-6, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-5, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-4, 'days'),
        },
        {
          count: 1,
          timestamp: startOfDay.add(-3, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-2, 'days'),
        },
        {
          count: 1,
          timestamp: startOfDay.add(-1, 'days'),
        },
      ])
    })

    it('fills missing with 0s after last processed til yesterday', () => {
      const result = postprocessCounts(
        [
          {
            count: 1,
            timestamp: startOfDay.add(-6, 'days'),
          },
          {
            count: 1,
            timestamp: startOfDay.add(-3, 'days'),
          },
        ],
        true,
        startOfDay.add(1, 'hours'),
      )

      expect(result).toEqual([
        {
          count: 1,
          timestamp: startOfDay.add(-6, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-5, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-4, 'days'),
        },
        {
          count: 1,
          timestamp: startOfDay.add(-3, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-2, 'days'),
        },
        {
          count: 0,
          timestamp: startOfDay.add(-1, 'days'),
        },
      ])
    })
  })
})
