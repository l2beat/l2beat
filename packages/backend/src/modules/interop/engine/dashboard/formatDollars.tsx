import { formatLargeNumber } from '@l2beat/shared-pure'

export function formatDollars(
  value: number | string | null | undefined,
): string {
  if (value == null || value === '') return '-'
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (isNaN(num)) return '-'
  return '$' + formatLargeNumber(num)
}
