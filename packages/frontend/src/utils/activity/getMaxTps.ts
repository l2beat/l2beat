import { ActivityApiChartPoint } from '@l2beat/shared-pure'

import { formatTimestamp } from '../dates'

const SECONDS_IN_A_DAY = 24 * 60 * 60

export function getMaxTps(
  data: ActivityApiChartPoint[] | undefined,
): { maxTps: number; maxTpsDate: string } | undefined {
  if (!data || data.length === 0) {
    return
  }

  const maxEntry = data.reduce((max, current) =>
    current[1] > max[1] ? current : max,
  )

  return {
    maxTps: maxEntry[1] / SECONDS_IN_A_DAY,
    maxTpsDate: formatTimestamp(maxEntry[0].toNumber()),
  }
}
