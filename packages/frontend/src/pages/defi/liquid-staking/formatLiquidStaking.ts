/** A fraction as a percentage, e.g. 0.0312 → "3.12%". */
export function formatYield(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function formatDays(value: number): string {
  const days = Number(value.toFixed(1))
  return `${days} day${days === 1 ? '' : 's'}`
}
