import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'

import { ReportRecord } from '../../../peripherals/database/ReportRepository'
import { UpdaterStatus } from '../../status/api/view/TvlStatusPage'

export interface ReportUpdater {
  getChainId: () => ChainId
  getConfigHash: () => Hash256
  getMinTimestamp: () => UnixTime
  getStatus: () => UpdaterStatus
  getReportsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs?: number,
  ): Promise<ReportRecord[]>
}

export interface DataUpdater {
  getStatus: () => UpdaterStatus
}
