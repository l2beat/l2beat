import { ActivityApiChartPoint, assert } from '@l2beat/shared-pure'

export function getTransactionCount(
  data: ActivityApiChartPoint[],
  type: 'project' | 'ethereum',
  days: number,
): number {
  assert(days >= 1, 'Days must be at least 1')

  const dataIndex = type === 'ethereum' ? 2 : 1
  const lastSevenDays = data.slice(-days)
  return lastSevenDays
    .map((d) => d[dataIndex])
    .reduce((prev, curr) => prev + curr, 0)
}
