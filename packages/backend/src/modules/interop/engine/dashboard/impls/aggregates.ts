import type { Database } from '@l2beat/database'
import { InteropTransferClassifier } from '@l2beat/shared'
import { UnixTime } from '@l2beat/shared-pure'
import type { InteropAggregationConfig } from '../../../../../config/features/interop'
import {
  buildDurationSplitCoverageRows,
  buildNotIncludedInAggregatesRows,
} from '../aggregates/utils'
import { toInteropTransferDetailsRecord } from './transfers'

export interface InteropAggregatesData {
  aggregationConfigured: boolean
  aggregationConfigsCount: number
  latestTimestamp: number | null
  latestTransfersCount: number
  includedTransfersCount: number
  notIncludedTransfers: ReturnType<typeof toInteropTransferDetailsRecord>[]
  notIncludedByPlugin: ReturnType<typeof buildNotIncludedInAggregatesRows>
  durationSplitCoverage: ReturnType<typeof buildDurationSplitCoverageRows>
}

export async function getInteropAggregates(
  db: Database,
  configs: InteropAggregationConfig[],
): Promise<InteropAggregatesData> {
  if (configs.length === 0) {
    return {
      aggregationConfigured: false,
      aggregationConfigsCount: 0,
      latestTimestamp: null,
      latestTransfersCount: 0,
      includedTransfersCount: 0,
      notIncludedTransfers: [],
      notIncludedByPlugin: [],
      durationSplitCoverage: [],
    }
  }

  const latestTimestamp =
    await db.aggregatedInteropTransfer.getLatestTimestamp()

  if (!latestTimestamp) {
    return {
      aggregationConfigured: true,
      aggregationConfigsCount: configs.length,
      latestTimestamp: null,
      latestTransfersCount: 0,
      includedTransfersCount: 0,
      notIncludedTransfers: [],
      notIncludedByPlugin: [],
      durationSplitCoverage: [],
    }
  }

  const from = latestTimestamp - UnixTime.DAY
  const transfers = await db.interopTransfer.getByRange(from, latestTimestamp)

  const classifier = new InteropTransferClassifier()
  const consumedIds = new Set<string>()

  for (const config of configs) {
    const classifiedTransfers = classifier.classifyTransfers(
      transfers,
      config.plugins,
    )

    for (const records of Object.values(classifiedTransfers)) {
      for (const record of records) {
        consumedIds.add(record.transferId)
      }
    }
  }

  const notIncludedTransfers = transfers
    .filter((transfer) => !consumedIds.has(transfer.transferId))
    .map(toInteropTransferDetailsRecord)

  return {
    aggregationConfigured: true,
    aggregationConfigsCount: configs.length,
    latestTimestamp,
    latestTransfersCount: transfers.length,
    includedTransfersCount: transfers.length - notIncludedTransfers.length,
    notIncludedTransfers,
    notIncludedByPlugin: buildNotIncludedInAggregatesRows(
      transfers.filter((transfer) => !consumedIds.has(transfer.transferId)),
    ),
    durationSplitCoverage: buildDurationSplitCoverageRows(transfers, configs),
  }
}
