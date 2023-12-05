import { getSortingOrder } from '../../../../components/table/props/getSortingOrder'
import { ActivityViewEntry, ActivityViewSortingOrder } from '../view/types'

export function getScalingActivityViewOrder(
  entries: ActivityViewEntry[],
): ActivityViewSortingOrder {
  return {
    name: getSortingOrder(entries, (a, b) =>
      a.name.toLowerCase().localeCompare(b.name.toLowerCase()),
    ),
    maxDailyTps: getSortingOrder(entries, (a, b) => {
      const aTps = a.maxTps ?? 0
      const bTps = b.maxTps ?? 0
      return bTps - aTps
    }),
    pastDayTps: getSortingOrder(entries, (a, b) => {
      const aTps = a.tpsDaily ?? -1
      const bTps = b.tpsDaily ?? -1
      return bTps - aTps
    }),
    sevenDayChange: getSortingOrder(entries, (a, b) => {
      const aChange = parseFloat(a.tpsWeeklyChange)
      const bChange = parseFloat(b.tpsWeeklyChange)
      return bChange - aChange
    }),
    thirtyDayTxCount: getSortingOrder(entries, (a, b) => {
      const aTxCount = a.transactionsMonthlyCount ?? 0
      const bTxCount = b.transactionsMonthlyCount ?? 0
      return bTxCount - aTxCount
    }),
  }
}
