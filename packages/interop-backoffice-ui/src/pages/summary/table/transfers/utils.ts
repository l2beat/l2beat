import { formatLargeNumber, formatSeconds } from '@l2beat/shared-pure'

export function formatDuration(seconds: number | undefined) {
  if (!seconds || Number.isNaN(seconds)) {
    return '-'
  }

  return formatSeconds(seconds)
}

export function formatDollars(
  value: number | string | null | undefined,
): string {
  if (value == null || value === '') return '-'
  const num = typeof value === 'string' ? Number.parseFloat(value) : value
  if (Number.isNaN(num)) return '-'
  return `$${formatLargeNumber(num)}`
}
