import { expect } from 'earl'

import { formatCurrency } from './formatCurrency'

describe(formatCurrency.name, () => {
  it('formats positive usd values with symbol first', () => {
    const result = formatCurrency(59.44, 'usd')
    expect(result).toEqual('$59.44')
  })

  it('formats negative usd values with minus before symbol', () => {
    const result = formatCurrency(-59.44, 'usd')
    expect(result).toEqual('-$59.44')
  })

  it('formats tiny positive usd values with comparator before symbol', () => {
    const result = formatCurrency(0.009, 'usd')
    expect(result).toEqual('<$0.01')
  })

  it('formats tiny negative usd values with minus before symbol', () => {
    const result = formatCurrency(-0.009, 'usd')
    expect(result).toEqual('>-$0.01')
  })
})
