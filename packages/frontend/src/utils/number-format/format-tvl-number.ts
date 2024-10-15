import { formatCurrency } from './format-currency'
import { formatNumber } from './format-number'

export function formatTvlTableNumber(value: number): string {
  return formatCurrency(value, 'usd', { formatFn: formatTvl })
}

function formatTvl(value: number) {
  if (value >= 1_000_000) {
    return formatNumber(value, 2)
  }

  if (value >= 1_000) {
    const rounded = Math.round(value / 1000) * 1000
    return formatNumber(rounded, 0)
  }

  if (value === 0) {
    return '0'
  }

  return '<1K'
}
