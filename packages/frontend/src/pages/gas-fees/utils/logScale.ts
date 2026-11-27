/** A log scale over whole decades: 10^min to 10^max, at least one decade apart */
export interface LogScale {
  min: number
  max: number
}

/**
 * The decades around the positive values. `floor` fixes the lower end,
 * whatever the values. Without a positive value, the decade from 0.1 to 1
 */
export function logScaleOf(values: number[], floor?: number): LogScale {
  const exponents = values.filter((v) => v > 0).map(log10)
  if (exponents.length === 0)
    return { min: floor ?? -1, max: (floor ?? -1) + 1 }
  const min = floor ?? Math.floor(Math.min(...exponents))
  const max = Math.max(Math.ceil(Math.max(...exponents)), min + 1)
  return { min, max }
}

/**
 * From 0 at 10^min to 1 at 10^max; outside it for values beyond. Rounded,
 * since Node's and browsers' Math.log10 differ in the last digit, which
 * would break hydration
 */
export function logPosition(scale: LogScale, value: number): number {
  return round((log10(value) - scale.min) / (scale.max - scale.min))
}

/** Whether a value can be placed and lies within the scale */
export function isOnScale(scale: LogScale, value: number): boolean {
  if (!(value > 0)) return false
  const position = logPosition(scale, value)
  return position >= 0 && position <= 1
}

export function decadesOf(scale: LogScale): number[] {
  return Array.from(
    { length: scale.max - scale.min + 1 },
    (_, i) => 10 ** (scale.min + i),
  )
}

/** Percent, for a CSS position */
export function logPercent(scale: LogScale, value: number): string {
  return `${round(logPosition(scale, value) * 100)}%`
}

function log10(value: number) {
  return round(Math.log10(value))
}

function round(value: number) {
  return Math.round(value * 1e6) / 1e6
}
