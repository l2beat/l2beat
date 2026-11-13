import { formatNumberWithCommas } from '@l2beat/shared-pure'

/**
 * Stops at about one cent of the token's price, so rows of the same token
 * share a precision (USDC: 2 decimals, ETH at $3K: 5). Rounding the price's
 * magnitude keeps a stablecoin at $1.002 on two decimals.
 */
export function formatTokenAmount(
  amount: number,
  valueUsd: number | undefined,
): string {
  return formatNumberWithCommas(amount, {
    maximumFractionDigits: getMaxDecimals(amount, valueUsd),
  })
}

function getMaxDecimals(amount: number, valueUsd: number | undefined) {
  if (!valueUsd || amount <= 0) {
    return amount < 1 ? 6 : 2
  }
  const price = valueUsd / amount
  return Math.min(Math.max(Math.round(Math.log10(price)) + 2, 2), 6)
}
