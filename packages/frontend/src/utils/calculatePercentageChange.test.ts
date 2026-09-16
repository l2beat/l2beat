import { describe, expect, it } from 'vitest'
import {
  calculatePercentageChange,
  formatPercent,
} from './calculatePercentageChange'

describe('calculatePercentageChange', () => {
  it('returns 0 when now equals then', () => {
    expect(calculatePercentageChange(100, 100)).toStrictEqual(0)
  })

  it('returns 0 when then is 0', () => {
    expect(calculatePercentageChange(100, 0)).toStrictEqual(0)
  })

  it('returns 0 when now is less than 0.01', () => {
    expect(calculatePercentageChange(0.005, 100)).toStrictEqual(0)
  })

  it('calculates the correct percentage change', () => {
    expect(calculatePercentageChange(150, 100)).toStrictEqual(0.5)
  })

  it('returns 0 for invalid change values', () => {
    expect(
      calculatePercentageChange(Number.POSITIVE_INFINITY, 100),
    ).toStrictEqual(0)
    expect(calculatePercentageChange(Number.NaN, 100)).toStrictEqual(0)
  })
})

describe('formatPercent', () => {
  it('formats values greater than or equal to 1000 as ">1K%"', () => {
    expect(formatPercent(10)).toStrictEqual('>1K%')
  })

  it('formats values greater than or equal to 100 with no decimal places', () => {
    expect(formatPercent(1)).toStrictEqual('100%')
  })

  it('formats close values correctly', () => {
    const values = [
      { value: 0.9999943793529054, expected: '99.9%' },
      { value: 0.0999943793529054, expected: '9.99%' },
    ]

    for (const { value, expected } of values) {
      expect(formatPercent(value)).toStrictEqual(expected)
    }
  })

  it('formats values greater than or equal to 10 with one decimal place', () => {
    expect(formatPercent(0.15)).toStrictEqual('15.0%')
  })

  it('formats values less than 10 with two decimal places', () => {
    expect(formatPercent(0.075)).toStrictEqual('7.50%')
  })
})
