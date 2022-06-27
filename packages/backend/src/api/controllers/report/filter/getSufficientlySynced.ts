import { ReportRecord } from '../../../../peripherals/database/ReportRepository'
import { getNewestAssetsInProject } from './getNewestAssetsInProject'
import { getSyncedTimestamp } from './getSyncedTimestamp'

export function getSufficientlySynced(reports: ReportRecord[]) {
  const newestByAssetInProject = getNewestAssetsInProject(reports)
  const syncedTimestamp = getSyncedTimestamp(
    [...newestByAssetInProject.values()],
    'days',
  )

  const excluded = new Set<string>()
  for (const [key, timestamp] of newestByAssetInProject.entries()) {
    if (timestamp.lt(syncedTimestamp)) {
      excluded.add(key)
    }
  }

  return reports.filter(
    (report) =>
      report.timestamp.lte(syncedTimestamp) &&
      !excluded.has(
        `${report.projectId.toString()}-${report.asset.toString()}`,
      ),
  )
}
