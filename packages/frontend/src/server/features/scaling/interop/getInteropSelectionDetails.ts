import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { InteropSelectionDetailsParams } from './types'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  aggregateTransferSize,
  aggregateTransferType,
  type TransferSizeDataPoint,
  type TransferTypeDataPoint,
} from './utils/getTransferSizeChartData'

export interface InteropSelectionDetails {
  transferSize: TransferSizeDataPoint | undefined
  transferType: TransferTypeDataPoint | undefined
  snapshotTimestamp: UnixTime | undefined
}

export async function getInteropSelectionDetails(
  params: InteropSelectionDetailsParams,
): Promise<InteropSelectionDetails> {
  if (
    env.MOCK ||
    params.from.length === 0 ||
    params.to.length === 0 ||
    params.protocolIds.length === 0
  ) {
    return {
      transferSize: undefined,
      transferType: undefined,
      snapshotTimestamp: undefined,
    }
  }

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens(
      { from: params.from, to: params.to },
      undefined,
      params.protocolIds,
    )

  return {
    transferSize: aggregateTransferSize(records),
    transferType: aggregateTransferType(records),
    snapshotTimestamp,
  }
}
