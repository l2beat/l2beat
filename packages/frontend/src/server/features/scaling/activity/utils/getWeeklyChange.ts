import type { ActivityRecord } from '@l2beat/database'
import { calculatePercentageChange } from '~/utils/calculatePercentageChange'
import { getLastDayTps, getLastDayUops } from './getLastDay'

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
