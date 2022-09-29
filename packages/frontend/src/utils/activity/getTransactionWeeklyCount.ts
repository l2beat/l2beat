import { ActivityApiChartPoint } from '@l2beat/types'

export function getTransactionWeeklyCount(
  data: ActivityApiChartPoint[] | undefined,
): string {
  if (data === undefined) {
    return ''
  }

  const lastSevenDays = data.slice(-7)

  if (lastSevenDays === undefined) {
    return ''
  }

  return lastSevenDays
    .map((d) => d[1])
    .reduce((prev, curr) => prev + curr, 0)
    .toString()
}
