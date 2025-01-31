import type { ActivityRecord } from '@l2beat/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getLastDayTps, getLastDayUops } from './get-last-day'

export function getUopsWeeklyChange(records: ActivityRecord[]) {
  const uops = getLastDayUops(records)
  const uopsSevenDaysAgo = getLastDayUops(records, 7)

  return calculatePercentageChange(uops, uopsSevenDaysAgo)
}

export function getTpsWeeklyChange(records: ActivityRecord[]) {
  const tps = getLastDayTps(records)
  const tpsSevenDaysAgo = getLastDayTps(records, 7)

  return calculatePercentageChange(tps, tpsSevenDaysAgo)
}
