import { formatCurrency } from './formatCurrency'
import { formatNumber } from './formatNumber'

export function formatDollarValueNumber(value: number): string {
  return formatCurrency(value, 'usd', { formatFn: formatValue })
}

function formatValue(value: number) {
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
