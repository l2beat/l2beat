import { formatNumber } from './format-number'

export function formatInteger(value: number): string {
  if (value >= 1000) {
    return formatNumber(value)
  }

  return value.toFixed(0)
}
