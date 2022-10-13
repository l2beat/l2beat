import { ActivityApiChartPoint } from '@l2beat/types'

import { getPercentageChange } from '../utils'
import { getTpsDaily } from './getTpsDaily'

export function getTpsWeeklyChange(
  data: ActivityApiChartPoint[] | undefined,
): string {
  const tps = getTpsDaily(data)
  const tpsSevenDaysAgo = getTpsDaily(data, 7)

  if (!tps || !tpsSevenDaysAgo) {
    return ''
  }

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
