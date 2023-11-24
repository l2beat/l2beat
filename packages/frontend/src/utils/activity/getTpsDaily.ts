import { ActivityApiChartPoint } from '@l2beat/shared-pure'

const SECONDS_IN_A_DAY = 24 * 60 * 60

export function getTpsDaily(
  data: ActivityApiChartPoint[] | undefined,
  type: 'project' | 'ethereum',
  daysAgo = 0,
): number | undefined {
  if (data === undefined || data.length === 0) {
    return undefined
  }
  const dataIndex = type === 'ethereum' ? 2 : 1

  return (data.at(-(1 + daysAgo))?.[dataIndex] ?? 0) / SECONDS_IN_A_DAY
}
