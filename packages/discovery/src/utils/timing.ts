import { assert } from '@l2beat/backend-tools'

export function timed<R>(fn: () => R): { value: R; executionTime: number } {
  const start = performance.now()
  const value = fn()
  const end = performance.now()
  return {
    value,
    executionTime: end - start,
  }
}

export function getThroughput(
  count: number,
  executionTimeInMilliseconds: number,
): number {
  return Math.floor(count / (executionTimeInMilliseconds / 1000))
}

export function formatSI(value: number, unit: string): string {
  if (value === 0) {
    return `0 ${unit}`
  }

  const orderPrefix = [' ', ' K', ' M', ' G', ' T', ' P']
  const order = Math.floor(Math.log2(value) / Math.log2(1000))
  const newValue = value / Math.pow(1000, order)

  const prefix = orderPrefix[order]
  assert(
    prefix !== undefined,
    `Prefix should not be undefined for order ${order}`,
  )
  return `${newValue.toFixed(2)}${prefix}${unit}`
}
