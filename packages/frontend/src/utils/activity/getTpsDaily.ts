import { ActivityApiChartPoint } from '@l2beat/shared-pure'

const SECONDS_IN_A_DAY = 24 * 60 * 60

export function getTpsDaily(
  data: ActivityApiChartPoint[],
  type: 'project' | 'ethereum',
  daysAgo = 0,
): number {
  const dataIndex = type === 'ethereum' ? 2 : 1

  return (data.at(-(1 + daysAgo))?.[dataIndex] ?? 0) / SECONDS_IN_A_DAY
}
