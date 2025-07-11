import { assert } from '@l2beat/shared-pure'

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
  if (
    value === Number.POSITIVE_INFINITY ||
    value === Number.NEGATIVE_INFINITY
  ) {
    const sign = value > 0 ? '' : '-'
    return `${sign}∞ ${unit}`
  }

  const orderPrefix = [
    ' f',
    ' p',
    ' n',
    ' µ',
    ' m',
    ' ',
    ' K',
    ' M',
    ' G',
    ' T',
    ' P',
  ]
  const order = Math.floor(Math.log2(Math.abs(value)) / Math.log2(1000))
  const newValue = value / Math.pow(1000, order)

  const prefix = orderPrefix[order + 5]
  assert(
    prefix !== undefined,
    `Prefix should not be undefined for order ${order}`,
  )
  return `${newValue.toFixed(2).replace(/\.?0+$/, '')}${prefix}${unit}`
}
