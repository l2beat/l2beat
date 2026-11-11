/** A token amount without padding zeros: 200K AZTEC, 43.75M ETH, 0.05 ETH. */
export function formatCompactAmount(amount: number, symbol: string): string {
  const compact = amount.toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  })
  return `${compact} ${symbol}`
}
