export function asNumber(value: bigint, precision: number) {
  const intPart = value / 10n ** BigInt(precision)
  const decimalPart = value - intPart * 10n ** BigInt(precision)

  const zerosBefore = precision - decimalPart.toString().length

  return (
    Number(intPart) +
    Number(
      Number(
        `0.${'0'.repeat(zerosBefore >= 0 ? zerosBefore : 0)}${decimalPart}`,
      ).toFixed(precision),
    )
  )
}
