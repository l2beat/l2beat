import { formatLargeNumber } from './formatLargeNumber'

export function formatCurrency(
  value: number,
  currency: string,
  maxDecimals?: number,
) {
  let num
  let result

  switch (currency) {
    case 'usd': {
      num = formatLargeNumber(value, maxDecimals)
      result = `$${num}`
      break
    }
    case 'eth': {
      num = formatLargeNumber(value, maxDecimals ?? 4)
      result = `Ξ${num}`
      break
    }
    default: {
      num = formatLargeNumber(value, maxDecimals)
      result = `${num} ${currency.toUpperCase()}`
    }
  }

  const isRoundedToZero = num === '0.00' && value !== 0

  return isRoundedToZero ? `~${result}` : result
}

export function formatCurrencyExactValue(value: number, currency: string) {
  const string =
    currency === 'usd' || currency === 'USD'
      ? value.toFixed(2)
      : formatCrypto(value)
  const [integer, decimal = ''] = string.split('.')
  const formatted = formatInteger(integer)
  return formatted + (decimal && `.${decimal}`)
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
