/** The change from the first value to the last: for levels, e.g. TVS. */
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

const WEEK = 7

/**
 * The change from the first week's average to the last week's: for daily
 * flows, e.g. activity, which swing too much day to day for two single days
 * to stand for the trend. Their sparklines draw weekly averages too.
 */
export function computeWeeklyAverageChange(
  values: (number | null)[],
): number | undefined {
  const withData = values.filter((v): v is number => v !== null)
  if (withData.length < 2 * WEEK) {
    return undefined
  }
  const first = average(withData.slice(0, WEEK))
  const last = average(withData.slice(-WEEK))
  if (first === 0) {
    return undefined
  }
  return last / first - 1
}

function average(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0) / values.length
}
