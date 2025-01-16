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

  const roundedDownValue = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
    notation: 'compact',
    roundingMode: 'floor',
  }).format(value)

  return roundedDownValue.toString().replace(/(\d)([KMBT])/g, '$1\u200a$2')
}

export function formatNumberWithCommas(value: number, precision = 2): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formattedNumber
}
