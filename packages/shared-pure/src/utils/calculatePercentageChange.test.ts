import { expect } from 'earl'
import { calculatePercentageChange } from './calculatePercentageChange.js'

describe('calculatePercentageChange', () => {
  it('returns 0 when now equals then', () => {
    expect(calculatePercentageChange(100, 100)).toEqual(0)
  })

  it('returns 0 when then is 0', () => {
    expect(calculatePercentageChange(100, 0)).toEqual(0)
  })

  it('returns 0 when now is less than 0.01', () => {
    expect(calculatePercentageChange(0.005, 100)).toEqual(0)
  })

  it('calculates the correct percentage change', () => {
    expect(calculatePercentageChange(150, 100)).toEqual(0.5)
  })

  it('returns 0 for invalid change values', () => {
    expect(calculatePercentageChange(Number.POSITIVE_INFINITY, 100)).toEqual(0)
    expect(calculatePercentageChange(Number.NaN, 100)).toEqual(0)
  })
})
