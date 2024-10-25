import { type ActivityRecord } from '@l2beat/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getLastDayTps } from './get-last-day-tps'

export function getTpsWeeklyChange(records: ActivityRecord[]) {
  const tps = getLastDayTps(records)
  const tpsSevenDaysAgo = getLastDayTps(records, 7)

  return calculatePercentageChange(tps, tpsSevenDaysAgo)
}
