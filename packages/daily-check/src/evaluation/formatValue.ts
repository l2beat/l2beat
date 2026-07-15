import type { LensColumn } from '../dashboard/types'

export function formatValue(value: number, column?: LensColumn): string {
  const format = column?.params?.format
  if (format?.id === 'percent') {
    return `${(value * 100).toFixed(1)}%`
  }
  if (format?.id === 'duration') {
    return formatDuration(value, format.params?.fromUnit ?? 'seconds')
  }
  if (Number.isInteger(value)) {
    return String(value)
  }
  return value.toFixed(2)
}

function formatDuration(value: number, fromUnit: string): string {
  const unitMs: Record<string, number> = {
    milliseconds: 1,
    seconds: 1000,
    minutes: 60_000,
    hours: 3_600_000,
  }
  let ms = value * (unitMs[fromUnit] ?? 1)
  const negative = ms < 0
  ms = Math.abs(ms)
  const parts: string[] = []
  const units: [string, number][] = [
    ['d', 86_400_000],
    ['h', 3_600_000],
    ['m', 60_000],
    ['s', 1000],
  ]
  for (const [suffix, size] of units) {
    if (ms >= size && parts.length < 2) {
      parts.push(`${Math.floor(ms / size)}${suffix}`)
      ms %= size
    }
  }
  if (parts.length === 0) {
    return `${Math.round(ms)}ms`
  }
  return `${negative ? '-' : ''}${parts.join(' ')}`
}
