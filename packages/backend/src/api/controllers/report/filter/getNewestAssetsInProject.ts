import { UnixTime } from '@l2beat/common'

import { ReportRecord } from '../../../../peripherals/database/ReportRepository'

export function getNewestAssetsInProject(reports: ReportRecord[]) {
  const newestByAssetsInProject = new Map<string, UnixTime>()
  for (const report of reports) {
    const key = `${report.projectId.toString()}-${report.asset.toString()}`
    const newest = newestByAssetsInProject.get(key)
    if (!newest || newest.lt(report.timestamp)) {
      newestByAssetsInProject.set(key, report.timestamp)
    }
  }
  return newestByAssetsInProject
}
