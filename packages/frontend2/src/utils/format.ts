import round from 'lodash/round'

import { formatNumber } from './format-number'

const currencyToSymbol: Record<string, string> = {
  usd: '$',
  eth: 'Ξ',
}

interface FormatCurrencyOptions {
  decimals?: number
  showLessThanMinimum?: boolean
}

export function formatCurrency(
  value: number,
  currency: string,
  opts?: FormatCurrencyOptions,
) {
  const symbol = currencyToSymbol[currency.toLowerCase()]

  const decimals = opts?.decimals ?? 2
  const showLessThanMinimum = opts?.showLessThanMinimum ?? true

  if (showLessThanMinimum) {
    const minimum = round(Math.pow(10, -decimals), decimals)
    if (value < minimum) {
      return symbol
        ? `<${symbol}${minimum}`
        : `<${minimum} ${currency.toUpperCase()}`
    }
  }

  const num = formatNumber(value, decimals)
  return symbol ? `${symbol}${num}` : `${num} ${currency.toUpperCase()}`
}
