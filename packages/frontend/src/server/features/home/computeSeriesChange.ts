/** Relative change between the first and last non-null values, i.e. over the
 * whole chart range. */
export function computeSeriesChange(
  values: (number | null)[],
): number | undefined {
  const withData = values.filter((v): v is number => v !== null)
  const first = withData.at(0)
  const last = withData.at(-1)
  if (first === undefined || first === 0 || last === undefined) {
    return undefined
  }
  return last / first - 1
}
