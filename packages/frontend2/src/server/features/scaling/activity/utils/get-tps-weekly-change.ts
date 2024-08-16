import { type DailyTransactionCountRecord } from '@l2beat/database'
import { getPercentageChange } from '~/utils/get-percentage-change'
import { getLastDayTps } from './get-last-day-tps'

export function getTpsWeeklyChange(records: DailyTransactionCountRecord[]) {
  const tps = getLastDayTps(records)
  const tpsSevenDaysAgo = getLastDayTps(records, 7)

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
