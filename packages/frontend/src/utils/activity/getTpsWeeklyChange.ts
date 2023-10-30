import { ActivityApiChartPoint } from '@l2beat/shared-pure'

import { formatPercent, getPercentageChange } from '../utils'
import { getTpsDaily } from './getTpsDaily'

export function getTpsWeeklyChange(
  data: ActivityApiChartPoint[] | undefined,
  type: 'project' | 'ethereum',
): string {
  const tps = getTpsDaily(data, type)
  const tpsSevenDaysAgo = getTpsDaily(data, type, 7)

  if (tps === undefined || tpsSevenDaysAgo === undefined) {
    return ''
  }

  if (tpsSevenDaysAgo === 0) {
    return '+' + formatPercent(0)
  }

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
