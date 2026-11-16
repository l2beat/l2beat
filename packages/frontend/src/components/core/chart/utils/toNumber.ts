/** A chart value: a finite number. NaN, infinities and the rest are gaps. */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function toNumber(value: unknown): number | null {
  return isNumber(value) ? value : null
}
