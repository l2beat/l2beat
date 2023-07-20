import { ChainId, Hash256, UnixTime } from '@l2beat/shared-pure'

import { ReportRecord } from '../../peripherals/database/ReportRepository'

export interface AssetUpdater {
  getChainId: () => ChainId
  getConfigHash: () => Hash256
  getMinTimestamp: () => UnixTime
  getReportsWhenReady(
    timestamp: UnixTime,
    refreshIntervalMs?: number,
  ): Promise<ReportRecord[]>
}
