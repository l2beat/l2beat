import { ActivityApiChartPoint } from '@l2beat/types'

export function getTransactionWeeklyCount(
  data: ActivityApiChartPoint[] | undefined,
): number | undefined {
  if (data === undefined || data.length < 7) {
    return undefined
  }

  const lastSevenDays = data.slice(-7)

  return lastSevenDays.map((d) => d[1]).reduce((prev, curr) => prev + curr, 0)
}
