import { getFirstTwoNonZeroPrecision } from '../get-first-two-non-zero-precision'
import { formatNumber } from './format-number'

export function formatTps(
  tps: number,
  opts?: { morePrecision: boolean },
): string {
  if (tps === 0) {
    return '0.00'
  }

  const decimals =
    opts?.morePrecision && tps < 1 ? getFirstTwoNonZeroPrecision(tps) : 2
  return formatNumber(tps, decimals)
}
