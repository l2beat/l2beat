/** Three significant figures, trailing zeros dropped: a blob fee runs from the 1 wei floor, a billionth of a gwei, to tens */
export function formatGwei(value: number): string {
  if (value === 0) return '0'
  const digits = Math.max(0, 2 - Math.floor(Math.log10(Math.abs(value))))
  // toFixed, as String writes a billionth as 1e-9
  const fixed = value.toFixed(digits)
  return fixed.includes('.') ? fixed.replace(/\.?0+$/, '') : fixed
}
