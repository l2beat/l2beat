export function formatCompactAmount(amount: number, symbol: string): string {
  const compact = amount.toLocaleString('en-US', {
    notation: 'compact',
    maximumFractionDigits: 2,
  })
  return `${compact} ${symbol}`
}
