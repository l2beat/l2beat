import { type DailyTransactionCountRecord } from '@l2beat/database'
import { UnixTime } from '@l2beat/shared-pure'

export function getLastDayTps(
  records: DailyTransactionCountRecord[],
  daysAgo = 0,
) {
  const lastRecord = records.at(-(1 + daysAgo))

  return (lastRecord?.count ?? 0) / UnixTime.DAY
}
