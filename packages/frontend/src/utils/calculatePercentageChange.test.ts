import { expect } from 'earl'
import { formatPercent } from './calculatePercentageChange'

describe('formatPercent', () => {
  it('formats values greater than or equal to 1000 as ">1K%"', () => {
    expect(formatPercent(10)).toEqual('>1K%')
  })

  it('formats values greater than or equal to 100 with no decimal places', () => {
    expect(formatPercent(1)).toEqual('100%')
  })

  it('formats close values correctly', () => {
    const values = [
      { value: 0.9999943793529054, expected: '99.9%' },
      { value: 0.0999943793529054, expected: '9.99%' },
    ]

    for (const { value, expected } of values) {
      expect(formatPercent(value)).toEqual(expected)
    }
  })

  it('formats values greater than or equal to 10 with one decimal place', () => {
    expect(formatPercent(0.15)).toEqual('15.0%')
  })

  it('formats values less than 10 with two decimal places', () => {
    expect(formatPercent(0.075)).toEqual('7.50%')
  })
})
