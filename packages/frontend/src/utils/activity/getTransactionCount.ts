import { ActivityApiChartPoint } from '@l2beat/shared-pure'

export function getTransactionCount(
  data: ActivityApiChartPoint[],
  type: 'project' | 'ethereum',
  period: 'month' | 'week',
): number {
  const dataIndex = type === 'ethereum' ? 2 : 1
  const length = period === 'month' ? 30 : 7
  const lastSevenDays = data.slice(-length)
  return lastSevenDays
    .map((d) => d[dataIndex])
    .reduce((prev, curr) => prev + curr, 0)
}
