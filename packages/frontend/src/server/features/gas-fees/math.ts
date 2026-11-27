export function sum(values: number[]): number {
  return values.reduce((a, b) => a + b, 0)
}

export function mean(values: number[]): number | null {
  return values.length === 0 ? null : sum(values) / values.length
}

export function median(values: number[]): number | null {
  if (values.length === 0) return null
  const sorted = [...values].sort((a, b) => a - b)
  const middle = Math.floor(sorted.length / 2)
  return sorted.length % 2
    ? (sorted[middle] ?? null)
    : ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
}
