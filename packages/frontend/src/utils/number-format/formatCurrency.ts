import type { StringWithAutocomplete } from '@l2beat/shared-pure'
import { assert } from '@l2beat/shared-pure'
import { formatNumber } from './formatNumber'

const currencyToSymbol: Record<string, string> = {
  usd: '$',
  eth: 'Ξ',
}

interface FormatCurrencyOptions {
  decimals?: number
  formatFn?: (value: number, decimals: number) => string
}

export function formatCurrency(
  value: number,
  currency: StringWithAutocomplete<'usd' | 'eth'>,
  opts?: FormatCurrencyOptions,
) {
  const symbol = currencyToSymbol[currency.toLowerCase()]

  const decimals = opts?.decimals ?? 2

  const formatFn = opts?.formatFn ?? formatNumber
  const num = formatFn(value, decimals)

  if (symbol) {
    if (num.startsWith('<') || num.startsWith('>')) {
      return `${num.slice(0, 1)}${symbol}${num.slice(1)}`
    }

    return `${symbol}${num}`
  }

  return `${num} ${currency}`
}

export function formatCurrencyExactValue(value: number, currency: string) {
  const string =
    currency === 'usd' || currency === 'USD'
      ? value.toFixed(2)
      : formatCrypto(value)
  const [integer, decimal = ''] = string.split('.')
  assert(integer !== undefined, 'Programmer error: integer is undefined')
  const formatted = formatInteger(integer)
  return formatted + (decimal && `.${decimal}`)
}

function formatCrypto(value: number) {
  if (value < 1) {
    return value.toFixed(6)
  }
  if (value < 100) {
    return value.toFixed(3)
  }
  return value.toFixed(2)
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
