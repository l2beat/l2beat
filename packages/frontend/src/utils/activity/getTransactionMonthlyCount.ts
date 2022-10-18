import { ActivityApiChartPoint } from '@l2beat/types'

export function getTransactionMonthlyCount(
  data: ActivityApiChartPoint[] | undefined,
): number | undefined {
  if (data === undefined) {
    return undefined
  }
  const lastSevenDays = data.slice(-30)
  return lastSevenDays.map((d) => d[1]).reduce((prev, curr) => prev + curr, 0)
}
