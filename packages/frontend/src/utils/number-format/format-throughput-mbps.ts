export function formatThroughputMBPS(bytes: number): string {
  if (bytes === 0) {
    return '0 MiB/s'
  }

  const mib = bytes / 1024 ** 2

  // Round to at most 4 digits
  const numDigitsBeforeDecimal = Math.floor(Math.log10(mib)) + 1
  const decimalPlaces = Math.max(0, 3 - numDigitsBeforeDecimal)
  const formattedThroughput = Number(mib.toFixed(decimalPlaces))

  return `${formattedThroughput} MiB/s`
}
