import { expect } from 'earl'

import { unifyPercentagesAsIntegers } from './math'

describe('math', () => {
  describe(unifyPercentagesAsIntegers.name, () => {
    it('works for four parts', () => {
      expect(
        unifyPercentagesAsIntegers([13.626332, 47.989636, 9.596008, 28.788024]),
      ).toEqual([14, 48, 9, 29])
    })

    it('works for three parts', () => {
      expect(
        unifyPercentagesAsIntegers([72.514053, 3.63521, 23.850735]),
      ).toEqual([72, 4, 24])
    })

    it('works for one third', () => {
      expect(unifyPercentagesAsIntegers([100 / 3, 100 / 3, 100 / 3])).toEqual([
        34, 33, 33,
      ])
    })

    it('works for two parts', () => {
      expect(unifyPercentagesAsIntegers([54.50814, 45.491859])).toEqual([
        55, 45,
      ])
    })

    it('works for four parts already integers', () => {
      expect(unifyPercentagesAsIntegers([14, 48, 9, 29])).toEqual([
        14, 48, 9, 29,
      ])
    })

    it('works for three parts already integers', () => {
      expect(unifyPercentagesAsIntegers([72, 4, 24])).toEqual([72, 4, 24])
    })

    it('works for two parts already integers', () => {
      expect(unifyPercentagesAsIntegers([55, 45])).toEqual([55, 45])
    })

    it('throws if does not sum to 100', () => {
      expect(() => unifyPercentagesAsIntegers([14, 42, 9, 29])).toThrow(
        'Values do not sum to 100',
      )
    })

    it('throws if only one value in array', () => {
      expect(() => unifyPercentagesAsIntegers([1])).toThrow(
        'Array has to contain at least two elements',
      )
    })
  })
})
