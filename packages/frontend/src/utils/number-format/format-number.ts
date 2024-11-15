import { assert } from '@l2beat/shared-pure'

const units = ['', 'K', 'M', 'B', 'T']

const HAIR_SPACE = '\u200a'

export function formatNumber(value: number, decimals = 2): string {
  const minimum = Math.pow(10, -decimals)

  if (value > 0 && value < minimum) {
    return `<${minimum}`
  }

  if (value < 0 && value > -minimum) {
    return `>-${minimum}`
  }

  if (value < 0) {
    return `-${formatNumber(-value, decimals)}`
  }

  if (value < 1) {
    return value.toFixed(decimals)
  }

  let unitIndex = 0
  while (value >= 1000 && unitIndex < units.length - 1) {
    value /= 1000
    unitIndex++
  }

  const roundedDownValue =
    Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals)

  const unit = units[unitIndex]
  assert(unit !== undefined, `No unit for value ${value}`)

  return roundedDownValue.toFixed(decimals) + withSpace(unit)
}

function withSpace(unit: string) {
  if (unit) {
    return HAIR_SPACE + unit
  }
  return unit
}

export function formatNumberWithCommas(value: number, precision = 2): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formattedNumber
}
