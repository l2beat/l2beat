import { ActivityApiChartPoint } from '@l2beat/shared-pure'

export function getTransactionCount(
  data: ActivityApiChartPoint[] | undefined,
  type: 'project' | 'ethereum',
  period: 'month' | 'week',
): number | undefined {
  if (data === undefined) {
    return undefined
  }
  const dataIndex = type === 'project' ? 1 : 2
  const length = period === 'month' ? 30 : 7
  const lastSevenDays = data.slice(-length)
  return lastSevenDays
    .map((d) => d[dataIndex])
    .reduce((prev, curr) => prev + curr, 0)
}
