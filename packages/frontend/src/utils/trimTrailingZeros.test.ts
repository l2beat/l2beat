import { expect } from 'earl'
import { trimTrailingZeros } from './trimTrailingZeros'

describe(trimTrailingZeros.name, () => {
  it('drops zero decimals and the point', () => {
    expect(trimTrailingZeros('15.00')).toEqual('15')
    expect(trimTrailingZeros('0.00')).toEqual('0')
  })

  it('keeps significant decimals', () => {
    expect(trimTrailingZeros('2.50')).toEqual('2.5')
    expect(trimTrailingZeros('1.21')).toEqual('1.21')
  })

  it('keeps the unit suffix', () => {
    expect(trimTrailingZeros('2.50K')).toEqual('2.5K')
    expect(trimTrailingZeros('3.00%')).toEqual('3%')
    expect(trimTrailingZeros('1.00x')).toEqual('1x')
  })

  it('leaves whole numbers alone', () => {
    expect(trimTrailingZeros('100')).toEqual('100')
    expect(trimTrailingZeros('1,000')).toEqual('1,000')
  })
})
