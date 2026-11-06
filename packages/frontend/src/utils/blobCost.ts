import { formatCurrency } from '@l2beat/shared-pure'

const GAS_PER_BLOB = 131072
const GWEI_PER_ETH = 1e9

/** What one blob costs at `blobBaseFeeGwei` per blob gas */
export function blobCostUsd(
  blobBaseFeeGwei: number,
  ethPriceUsd: number,
): number {
  return ((blobBaseFeeGwei * GAS_PER_BLOB) / GWEI_PER_ETH) * ethPriceUsd
}

/** Cents when it is dollars, two figures when it is less: a blob runs from a tenth of a cent to dollars */
export function formatBlobCost(usd: number): string {
  if (usd >= 1) return formatCurrency(usd, 'usd')
  if (usd === 0) return '$0'
  const decimals = 1 - Math.floor(Math.log10(usd))
  return `$${usd.toFixed(Math.min(decimals, 8))}`
}
