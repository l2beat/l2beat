import { assert } from '@l2beat/shared-pure'
import sum from 'lodash/sum'

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
  if (mad === 0) return current === med ? 0 : Number.POSITIVE_INFINITY
  return (current - med) / (1.4826 * mad)
}

export function zClassic(values: number[]) {
  if (values.length < 2) {
    return null
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const mean = sum(prev) / prev.length
  const varPop = prev.reduce((acc, v) => acc + (v - mean) ** 2, 0) / prev.length
  const std = Math.sqrt(varPop)
  if (std === 0) return current === mean ? 0 : null
  return (current - mean) / std
}

export function flatLine(values: number[]) {
  const unique = [...new Set(values)]

  return unique.length === 1
}

export function ratioDrop(
  values: number[],
  threshold = 0.1 /* 90% sudden drop */,
) {
  if (values.length <= 2) {
    return false
  }

  const prev = values.slice(0, -1)
  const current = values.at(-1)

  assert(prev.length > 0, 'Previous values must be defined')
  assert(current !== undefined, 'Current value must be defined')

  return current / median(prev) < threshold
}

export function ratioSpike(values: number[], threshold = 1.9 /* +90% */) {
  if (values.length <= 2) return false
  const prev = values.slice(0, -1)
  const current = values.at(-1)
  assert(current !== undefined, 'Current value must be defined')
  const base = median(prev)
  if (base === 0) return current > 0
  return current / base > threshold
}

export function lastNValues(values: number[], n: number) {
  if (values.length < n) {
    return values
  }
  return values.slice(-n)
}
