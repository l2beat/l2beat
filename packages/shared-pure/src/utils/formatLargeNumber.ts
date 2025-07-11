// this file is an exact copy of frontend/src/utils/formatLargeNumber.ts
// and serves as a reminder to resolve the issue of shared package
// that when used inside frontend dynamic code it breaks the runtime
// because of the bundler including all the code from shared package, even node dependencies

const units = ['', 'K', 'M', 'B', 'T']

const HAIR_SPACE = '\u200a'

export function formatLargeNumber(value: number): string {
  if (value === 0) {
    return '0.00'
  }
  if (value < 0) {
    return `-${formatLargeNumber(-value)}`
  }
  const str = Math.floor(value * 100).toString()
  for (const [i, unit] of units.entries()) {
    if (str.length <= 4 + i * 3) {
      const offset = str.length - 2 - i * 3
      return (
        str.slice(0, offset) +
        '.' +
        str.slice(offset, offset + 2) +
        withSpace(unit)
      )
    }
    if (str.length === 5 + i * 3) {
      return str.slice(0, 3) + withSpace(unit)
    }
  }
  return str.slice(0, 1 - units.length * 3) + withSpace(units[units.length - 1])
}

function withSpace(unit: string) {
  if (unit) {
    return HAIR_SPACE + unit
  }
  return unit
}
