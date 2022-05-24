import { UnixTime } from '@l2beat/common'

import { ReportRecord } from '../../../../peripherals/database/ReportRepository'

export function getMaxAssetInBridge(reports: ReportRecord[]) {
  const maxByAssetInBridge = new Map<string, UnixTime>()
  for (const report of reports) {
    const key = `${report.bridge}-${report.asset}`
    const max = maxByAssetInBridge.get(key)
    if (!max || max.lt(report.timestamp)) {
      maxByAssetInBridge.set(key, report.timestamp)
    }
  }
  return maxByAssetInBridge
}
