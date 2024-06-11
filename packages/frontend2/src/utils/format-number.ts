export function formatNumberWithCommas(value: number): string {
  const formattedNumber = value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return formattedNumber
}
