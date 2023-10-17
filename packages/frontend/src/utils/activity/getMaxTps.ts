import { ActivityApiChartPoint } from '@l2beat/shared-pure'

import { formatTimestamp } from '../dates'

const SECONDS_IN_A_DAY = 24 * 60 * 60

export function getMaxTps(
  data: ActivityApiChartPoint[] | undefined,
  type: 'project' | 'ethereum',
): {
  maxTps: number | undefined
  maxTpsDate: string | undefined
} {
  if (!data || data.length === 0) {
    return {
      maxTps: undefined,
      maxTpsDate: undefined,
    }
  }
  const dataIndex = type === 'ethereum' ? 2 : 1

  const maxEntry = data.reduce((max, current) =>
    current[dataIndex] > max[dataIndex] ? current : max,
  )

  return {
    maxTps: maxEntry[dataIndex] / SECONDS_IN_A_DAY,
    maxTpsDate: formatTimestamp(maxEntry[0].toNumber()),
  }
}
