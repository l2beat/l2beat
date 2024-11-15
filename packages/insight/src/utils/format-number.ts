export function formatNumberWithCommas(value: number, precision = 2): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: precision,
    maximumFractionDigits: precision,
  })

  return formattedNumber
}
