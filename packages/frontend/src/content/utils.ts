import millify from 'millify'

export function getFromEnd<T>(array: T[], n: number) {
  if (n >= array.length) {
    return array[0]
  }
  return array[array.length - 1 - n]
}

export function getPercentageChange(now: number, then: number) {
  return formatPercent(now / then - 1, true)
}

export function formatPercent(value: number, addPlus = false) {
  const result = (value * 100).toFixed(2) + '%'
  if (addPlus && result[0] !== '-') {
    return '+' + result
  }
  return result
}

export function formatUSD(value: number) {
  return `$${millify(value)}`
}
