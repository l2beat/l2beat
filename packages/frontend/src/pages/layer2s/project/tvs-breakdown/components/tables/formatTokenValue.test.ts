import { expect } from 'earl'
import { formatTokenValue } from './formatTokenValue'

describe(formatTokenValue.name, () => {
  it('rounds values from $1 to whole dollars', () => {
    expect(formatTokenValue(6_007_852.5)).toEqual('$6,007,853')
    expect(formatTokenValue(4_417_108_500)).toEqual('$4,417,108,500')
    expect(formatTokenValue(1)).toEqual('$1')
  })

  it('keeps two decimals below $1', () => {
    expect(formatTokenValue(0.5)).toEqual('$0.50')
    expect(formatTokenValue(0.123)).toEqual('$0.12')
  })

  it('says a value under a cent is under a cent', () => {
    expect(formatTokenValue(0.004)).toEqual('<$0.01')
  })

  it('prints zero as zero', () => {
    expect(formatTokenValue(0)).toEqual('$0.00')
  })
})
