/** An annualised fraction as a percentage, e.g. 0.0312 → "3.12%". */
export function formatYield(value: number, decimals = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

/**
 * Costs of exit from a year up read as one: a thin pool or a yield near zero
 * can put one at thousands of days, which says no more than that.
 */
export const MAX_SHOWN_DAYS = 365

export function formatDays(value: number): string {
  if (value >= MAX_SHOWN_DAYS) return `${MAX_SHOWN_DAYS}+ days`
  const days = Number(value.toFixed(1))
  return `${days} day${days === 1 ? '' : 's'}`
}
