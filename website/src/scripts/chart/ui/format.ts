export function formatCurrency(value: number, currency: string) {
  const num = formatNumber(value)
  if (currency === 'usd') {
    return `$${num}`
  } else if (currency === 'eth') {
    return `Ξ${num}`
  } else {
    return `${num} ${currency.toUpperCase()}`
  }
}

const units = ['', 'K', 'M', 'B', 'T']

export function formatNumber(value: number) {
  let iter = 0
  while (value > 1e3 && iter < units.length) {
    value /= 1e3
    iter++
  }
  const unit = units[iter]
  return parseFloat(value.toFixed(2)) + unit
}
