import { type DailyTransactionCountRecord } from '@l2beat/database'
import { getLastDayTps } from './get-last-day-tps'
import { getPercentageChange } from '~/utils/get-percentage-change'

export function getTpsWeeklyChange(records: DailyTransactionCountRecord[]) {
  const tps = getLastDayTps(records)
  const tpsSevenDaysAgo = getLastDayTps(records, 7)

  return getPercentageChange(tps, tpsSevenDaysAgo)
}
