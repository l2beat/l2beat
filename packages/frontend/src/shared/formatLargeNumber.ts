const units = ['', 'K', 'M', 'B', 'T']

export function formatLargeNumber(value: number): string {
  if (value === 0) {
    return '0.00'
  } else if (value < 0) {
    return `-${formatLargeNumber(-value)}`
  }
  const str = Math.floor(value * 100).toString()
  for (const [i, unit] of units.entries()) {
    if (str.length <= 4 + i * 3) {
      const offset = str.length - 2 - i * 3
      return str.slice(0, offset) + '.' + str.slice(offset, offset + 2) + unit
    } else if (str.length === 5 + i * 3) {
      return str.slice(0, 3) + unit
    }
  }
  return str.slice(0, 1 - units.length * 3) + units[units.length - 1]
}
