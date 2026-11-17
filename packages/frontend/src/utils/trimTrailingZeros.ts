/**
 * Drops the zeros a fixed number of decimals pads with, keeping any unit
 * suffix: "15.00 GiB" → "15 GiB", "2.50K" → "2.5K", "3.50%" → "3.5%". For
 * axis ticks, which round to two decimals but should show only the digits
 * that tell them apart.
 */
export function trimTrailingZeros(formatted: string): string {
  return formatted.replace(/\.(\d*?)0+(?=\D*$)/, (_, kept: string) =>
    kept ? `.${kept}` : '',
  )
}
