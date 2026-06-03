import type { UnixTime } from '@l2beat/shared-pure'
import { env } from '~/env'
import type { InteropSelectionDetailsParams } from './types'
import { getLatestAggregatedInteropTransferWithTokens } from './utils/getLatestAggregatedInteropTransferWithTokens'
import {
  aggregateTransferSize,
  type TransferSizeDataPoint,
} from './utils/getTransferSizeChartData'

export interface InteropSelectionDetails {
  transferSize: TransferSizeDataPoint | undefined
  snapshotTimestamp: UnixTime | undefined
}

/** Selection-aware details (across the chosen protocols + chains) powering the
 * always-visible bridge subsections: the aggregate transfer-size distribution
 * and the snapshot timestamp used by the transfers table. */
export async function getInteropSelectionDetails(
  params: InteropSelectionDetailsParams,
): Promise<InteropSelectionDetails> {
  if (
    env.MOCK ||
    params.from.length === 0 ||
    params.to.length === 0 ||
    params.protocolIds.length === 0
  ) {
    return { transferSize: undefined, snapshotTimestamp: undefined }
  }

  const { records, snapshotTimestamp } =
    await getLatestAggregatedInteropTransferWithTokens(
      { from: params.from, to: params.to },
      undefined,
      params.protocolIds,
    )

  return {
    transferSize: aggregateTransferSize(records),
    snapshotTimestamp,
  }
}
