const usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCompactUsd(value: number): string {
  return usdFormatter.format(value)
}

export function formatPct(value: number | undefined): string {
  return value === undefined ? '-' : `${value.toFixed(1)}%`
}
