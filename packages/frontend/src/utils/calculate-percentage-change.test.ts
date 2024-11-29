import { expect } from 'earl'
import {
  calculatePercentageChange,
  formatPercent,
} from './calculate-percentage-change'

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
    expect(calculatePercentageChange(Infinity, 100)).toEqual(0)
    expect(calculatePercentageChange(NaN, 100)).toEqual(0)
  })
})

describe('formatPercent', () => {
  it('formats values greater than or equal to 1000 as ">1K%"', () => {
    expect(formatPercent(10)).toEqual('>1K%')
  })

  it('formats values greater than or equal to 100 with no decimal places', () => {
    expect(formatPercent(1)).toEqual('100%')
  })

  it('formats values greater than or equal to 10 with one decimal place', () => {
    expect(formatPercent(0.15)).toEqual('15.0%')
  })

  it('formats values less than 10 with two decimal places', () => {
    expect(formatPercent(0.075)).toEqual('7.50%')
  })
})
