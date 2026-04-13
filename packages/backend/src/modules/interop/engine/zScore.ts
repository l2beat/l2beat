import { assert } from '@l2beat/shared-pure'

export const Z_CLASSIC_THRESHOLD = 7
export const Z_ROBUST_THRESHOLD = {
  warn: 4,
  drop: -6,
  spike: 6,
}
export const MIN_NON_ZERO_HISTORY_POINTS = 3
export const Z_WINDOW_DAYS = 14

export type ZScore = {
  robust: number | null
  classic: number | null
}

export function log1Plus(x: number) {
  return Math.log(1 + x)
}

export function median(values: number[]) {
  assert(values.length > 0, 'Values must be non-empty')
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  if (sorted.length % 2 === 0) {
    return (sorted[middle - 1] + sorted[middle]) / 2
  }
  return sorted[middle]
}

export function MAD(values: number[]) {
  const med = median(values)
  const deviations = values.map((value) => Math.abs(value - med))
  return median(deviations)
}

/**
 * For a standard normal distribution:
 * - Median = 0
 * - Median of |X| ≈ 0.67449
 *
 * σ ≈ MAD / 0.67449 ≈ MAD × 1.4826
 */
export function zRobust(values: number[]) {
  if (values.length < 2) {
    return null
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const med = median(prev)
  const mad = MAD(prev)
  if (mad === 0) return current === med ? 0 : null
  return (current - med) / (1.4826 * mad)
}

export function zClassic(values: number[]) {
  if (values.length < 2) {
    return null
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const mean = prev.reduce((sum, value) => sum + value, 0) / prev.length
  const variance =
    prev.reduce((sum, value) => sum + (value - mean) ** 2, 0) / prev.length
  const stdDev = Math.sqrt(variance)
  if (stdDev === 0) return current === mean ? 0 : null
  return (current - mean) / stdDev
}

export function hasEnoughNonZeroHistory(
  values: number[],
  minNonZeroPoints = MIN_NON_ZERO_HISTORY_POINTS,
) {
  if (values.length <= 2) {
    return false
  }

  const prev = values.slice(0, -1)
  const nonZeroPoints = prev.filter((value) => value > 0).length
  return nonZeroPoints >= minNonZeroPoints
}

export function getWindowedLogZScore(
  values: number[],
  options?: {
    windowDays?: number
    minNonZeroHistoryPoints?: number
  },
): ZScore {
  const windowDays = options?.windowDays ?? Z_WINDOW_DAYS
  const minNonZeroHistoryPoints =
    options?.minNonZeroHistoryPoints ?? MIN_NON_ZERO_HISTORY_POINTS
  const window = values.slice(-windowDays)

  if (!hasEnoughNonZeroHistory(window, minNonZeroHistoryPoints)) {
    return { robust: null, classic: null }
  }

  const loggedWindow = window.map(log1Plus)

  return {
    robust: zRobust(loggedWindow),
    classic: zClassic(loggedWindow),
  }
}
