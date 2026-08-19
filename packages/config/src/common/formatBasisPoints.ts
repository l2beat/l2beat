export function formatBasisPoints(value: number): string {
  return `${Number((value / 100).toFixed(4))}%`
}
