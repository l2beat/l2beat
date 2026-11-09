import { expect } from 'earl'
import { getTokenAmountDecimals } from './getTokenAmountDecimals'

describe(getTokenAmountDecimals.name, () => {
  it('gives every amount of a dollar stablecoin two decimals', () => {
    expect(getTokenAmountDecimals(820.6312, 820.14)).toEqual(2)
    expect(getTokenAmountDecimals(0.998068, 1)).toEqual(2)
  })

  it('gives pricier tokens enough decimals to show cents', () => {
    expect(getTokenAmountDecimals(0.5, 1_500)).toEqual(5)
    expect(getTokenAmountDecimals(10, 1_000)).toEqual(4)
  })

  it('falls back to magnitude when the value is unknown', () => {
    expect(getTokenAmountDecimals(0.0123, undefined)).toEqual(6)
    expect(getTokenAmountDecimals(12.3, undefined)).toEqual(2)
  })
})
