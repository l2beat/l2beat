import { ActivityApiChartPoint } from '@l2beat/shared-pure'

import { formatPercent, getPercentageChange } from '../utils'
import { getTpsDaily } from './getTpsDaily'

export function getTpsWeeklyChange(
  data: ActivityApiChartPoint[] | undefined,
): string {
  const tps = getTpsDaily(data)
  const tpsSevenDaysAgo = getTpsDaily(data, 7)

  if (tps === undefined || tpsSevenDaysAgo === undefined) {
    return ''
  }

  if (tpsSevenDaysAgo === 0) {
    return '+' + formatPercent(0)
  }

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
