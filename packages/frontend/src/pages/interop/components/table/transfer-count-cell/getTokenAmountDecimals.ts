/**
 * Decimals that resolve about one cent of the token's price, so every row of
 * the same token shows the same precision (USDC: 2, ETH at $3K: 5). Rounding
 * the price's magnitude keeps a stablecoin at $1.002 on two decimals.
 */
export function getTokenAmountDecimals(
  amount: number,
  valueUsd: number | undefined,
): number {
  if (!valueUsd || amount <= 0) {
    return amount < 1 ? 6 : 2
  }
  const price = valueUsd / amount
  return Math.min(Math.max(Math.round(Math.log10(price)) + 2, 2), 6)
}
