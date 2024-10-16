import { getFirstTwoNonZeroPrecision } from '../get-first-two-non-zero-precision'
import { formatNumber } from './format-number'

export function formatTps(
  tps: number,
  opts?: { morePrecision: boolean },
): string {
  const decimals =
  opts?.morePrecision && tps < 1 ? getFirstTwoNonZeroPrecision(tps) : 2
  const minimum = 10 ** -decimals
  if (tps !== 0 && tps < minimum) {
    return '~0.00'
  }

  return formatNumber(tps, decimals)
}
