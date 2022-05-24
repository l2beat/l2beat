import { ReportRecord } from '../../../../peripherals/database/ReportRepository'
import { getMaxAssetInBridge } from './getMaxAssetsInBridge'
import { getSyncedTimestamp } from './getSyncedTimestamp'

export function getSufficientlySynced(reports: ReportRecord[]) {
  const maxByAssetInBridge = getMaxAssetInBridge(reports)
  const syncedTimestamp = getSyncedTimestamp(
    [...maxByAssetInBridge.values()],
    'days'
  )

  const excluded: Set<string> = new Set()
  for (const [key, timestamp] of maxByAssetInBridge.entries()) {
    if (timestamp.lt(syncedTimestamp)) {
      excluded.add(key)
    }
  }

  return reports.filter(
    (report) =>
      report.timestamp.lte(syncedTimestamp) &&
      !excluded.has(`${report.bridge}-${report.asset}`)
  )
}
