import { UnixTime } from '@l2beat/common'

import { ReportRecord } from '../../../../peripherals/database/ReportRepository'

export function getNewestAssetInProject(reports: ReportRecord[]) {
  const newestByAssetInProject = new Map<string, UnixTime>()
  for (const report of reports) {
    const key = `${report.projectId}-${report.asset}`
    const newest = newestByAssetInProject.get(key)
    if (!newest || newest.lt(report.timestamp)) {
      newestByAssetInProject.set(key, report.timestamp)
    }
  }
  return newestByAssetInProject
}
