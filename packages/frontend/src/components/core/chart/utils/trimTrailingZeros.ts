/**
 * Drops the zeros that fixed-decimal formatters pad round numbers with, from
 * the last number in the label: "$4.50 K" reads as "$4.5 K", "$0.00" as "$0"
 * and "2.00 GiB" as "2 GiB". Meant for axis ticks, which are round numbers.
 */
export function trimTrailingZeros(label: string) {
  return label.replace(/\.(\d*?)0+(?=\D*$)/, (_, digits: string) =>
    digits ? `.${digits}` : '',
  )
}
