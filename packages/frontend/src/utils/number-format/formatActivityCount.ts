import { formatNumber } from './formatNumber'

export function formatActivityCount(
  uops: number,
  opts?: { decimals?: number },
): string {
  const decimals = opts?.decimals ?? 2

  if (uops === 0) {
    const decimalsForZero = Math.min(decimals, 2)
    return `0${decimalsForZero === 0 ? '' : '.'}${'0'.repeat(decimalsForZero)}`
  }

  return formatNumber(uops, decimals)
}
