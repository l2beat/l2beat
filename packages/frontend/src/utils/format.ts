import round from 'lodash/round'

import { formatNumber } from './formatNumber'

const currencyToSymbol: Record<string, string> = {
  usd: '$',
  eth: 'Ξ',
}

export function formatCurrency(
  value: number,
  currency: string,
  decimals: number = 2,
) {
  const minimum = round(Math.pow(10, -decimals), decimals)
  const symbol = currencyToSymbol[currency.toLowerCase()]
  if (value < minimum) {
    return symbol
      ? `<${symbol}${minimum}`
      : `<${minimum} ${currency.toUpperCase()}`
  }

  const num = formatNumber(value, decimals)
  return symbol ? `${symbol}${num}` : `${num} ${currency.toUpperCase()}`
}

export function formatCurrencyExactValue(value: number, currency: string) {
  const string =
    currency === 'usd' || currency === 'USD'
      ? value.toFixed(2)
      : formatCrypto(value)
  const [integer, decimal = ''] = string.split('.')
  const formatted = formatInteger(integer)
  return formatted + (decimal && `.${decimal}`)
}

function formatCrypto(value: number) {
  if (value < 1) {
    return value.toFixed(6)
  } else if (value < 100) {
    return value.toFixed(3)
  } else {
    return value.toFixed(2)
  }
}

function formatInteger(integer: number | string): string {
  const value = integer.toString()
  if (value.startsWith('-')) {
    return '-' + formatInteger(value.substring(1))
  }
  const count = value.length / 3
  const resultValue = value.split('')
  for (let i = 1; i < count; i++) {
    resultValue.splice(-4 * i + 1, 0, ',')
  }
  return resultValue.join('')
}
