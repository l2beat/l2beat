/** Three significant figures, trailing zeros dropped: a blob fee runs from thousandths of a gwei to tens */
export function formatGwei(value: number): string {
  if (value === 0) return '0'
  const digits = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(value))))
  return String(Number(value.toFixed(Math.min(digits, 6))))
}
