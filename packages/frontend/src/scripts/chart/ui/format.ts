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

export function formatCurrencyExact(value: number, currency: string) {
  const string = currency === 'usd' ? value.toFixed(2) : formatCrypto(value)
  const [integer, decimal = ''] = string.split('.')
  const formatted = formatInteger(integer)
  return formatted + (decimal && `.${decimal}`) + ` ${currency.toUpperCase()}`
}

function formatCrypto(value: number) {
  if (value < 1) {
    return value.toFixed(6)
  } else if (value < 100) {
    return value.toFixed(3)
  } else {
    return value.toFixed(2)
  }
}

function formatInteger(integer: number | string): string {
  const value = integer.toString()
  if (value.startsWith('-')) {
    return '-' + formatInteger(value.substring(1))
  }
  const count = value.length / 3
  const resultValue = value.split('')
  for (let i = 1; i < count; i++) {
    resultValue.splice(-4 * i + 1, 0, ',')
  }
  return resultValue.join('')
}
