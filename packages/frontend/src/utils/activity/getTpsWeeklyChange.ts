import { ActivityApiChartPoint } from '@l2beat/types'

import { getPercentageChange } from '../utils'
import { getTpsDaily } from './getTpsDaily'

const SECONDS_IN_A_DAY = 24 * 60 * 60

export function getTpsWeeklyChange(
  data: ActivityApiChartPoint[] | undefined,
): string {
  if (data === undefined || data.length < 7) {
    return ''
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const tps = getTpsDaily(data)!
  const tpsSevenDaysAgo = (data.at(-7)?.[1] ?? 0) / SECONDS_IN_A_DAY

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
