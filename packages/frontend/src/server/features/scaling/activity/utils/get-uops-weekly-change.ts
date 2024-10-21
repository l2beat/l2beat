import { type ActivityRecord } from '@l2beat/database'
import { calculatePercentageChange } from '~/utils/calculate-percentage-change'
import { getLastDayUops } from './get-last-day-uops'

export function getUopsWeeklyChange(records: ActivityRecord[]) {
  const uops = getLastDayUops(records)
  const uopsSevenDaysAgo = getLastDayUops(records, 7)

  return calculatePercentageChange(uops, uopsSevenDaysAgo)
}
