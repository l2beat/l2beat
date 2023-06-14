import { ActivityApiChartPoint } from '@l2beat/shared-pure'

export function getTransactionCount(
  data: ActivityApiChartPoint[] | undefined,
  period: 'month' | 'week',
): number | undefined {
  if (data === undefined) {
    return undefined
  }
  const length = period === 'month' ? 30 : 7
  const lastSevenDays = data.slice(-length)
  return lastSevenDays.map((d) => d[1]).reduce((prev, curr) => prev + curr, 0)
}
