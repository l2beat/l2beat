import { ActivityApiChartPoint } from '@l2beat/shared-pure'

type Period = 'day' | 'week' | 'month' | 'three months'

const periodToLength: Record<Period, number> = {
  day: 1,
  week: 7,
  month: 30,
  'three months': 90,
}

export function getTransactionCount(
  data: ActivityApiChartPoint[],
  type: 'project' | 'ethereum',
  period: 'day' | 'week' | 'month' | 'three months',
): number {
  const dataIndex = type === 'ethereum' ? 2 : 1
  const length = periodToLength[period]
  const lastSevenDays = data.slice(-length)
  return lastSevenDays
    .map((d) => d[dataIndex])
    .reduce((prev, curr) => prev + curr, 0)
}
