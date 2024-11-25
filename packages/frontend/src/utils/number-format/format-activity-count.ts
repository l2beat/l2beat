import { getFirstTwoNonZeroPrecision } from '../get-first-two-non-zero-precision'
import { formatNumber } from './format-number'

export function formatActivityCount(
  uops: number,
  opts?: { morePrecision: boolean },
): string {
  if (uops === 0) {
    return '0.00'
  }

  const decimals =
    opts?.morePrecision && uops < 1 ? getFirstTwoNonZeroPrecision(uops) : 2
  return formatNumber(uops, decimals)
}
