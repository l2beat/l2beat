import { formatNumberWithCommas } from '@l2beat/shared-pure'

/**
 * A token's value in the breakdown table: whole dollars from $1, so one column
 * doesn't mix "$4,417,108,500" with "$6,007,852.5", and cents below $1.
 * Anything under a cent says so rather than reading as "$0.00".
 */
export function formatTokenValue(value: number) {
  if (value > 0 && value < 0.01) return '<$0.01'
  return `$${formatNumberWithCommas(
    value,
    value >= 1
      ? { maximumFractionDigits: 0 }
      : { minimumFractionDigits: 2, maximumFractionDigits: 2 },
  )}`
}
