export function formatThroughput(
  bytes: number,
  frequencySeconds: number,
): string {
  if (bytes === 0) {
    return '0 MB/s'
  }

  if (frequencySeconds === 0) {
    throw new Error('Frequency cannot be zero.')
  }

  const mb = bytes / 1_000
  const throughput = mb / frequencySeconds

  // Round to at most 4 digits
  const numDigitsBeforeDecimal = Math.floor(Math.log10(throughput)) + 1
  const decimalPlaces = Math.max(0, 3 - numDigitsBeforeDecimal)
  const formattedThroughput = Number(throughput.toFixed(decimalPlaces))

  return `${formattedThroughput} MB/s`
}
