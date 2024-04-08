import round from 'lodash/round'

const units = ['', 'K', 'M', 'B', 'T']

const HAIR_SPACE = '\u200a'

export function formatLargeNumber(value: number, maxDecimals = 2): string {
  const minimum = Math.pow(10, -maxDecimals)
  if (value === 0 || (value < minimum && value > -minimum)) {
    return '0.00'
  }

  if (value < 0) {
    return `-${formatLargeNumber(-value, maxDecimals)}`
  }

  if (value < 1) {
    return round(value, maxDecimals).toString()
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
    } else if (str.length === 5 + i * 3) {
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

export function formatLargeNumberWithCommas(value: number): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formattedNumber
}
