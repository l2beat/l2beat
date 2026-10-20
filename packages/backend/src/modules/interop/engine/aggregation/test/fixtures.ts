import type {
  AggregatedInteropTokenRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import type { UnixTime } from '@l2beat/shared-pure'

export function aggregatedTransfer(
  id: string,
  srcChain: string,
  dstChain: string,
  timestamp: UnixTime,
  transferCount: number,
  overrides: Partial<AggregatedInteropTransferRecord> = {},
): AggregatedInteropTransferRecord {
  return {
    timestamp,
    id,
    bridgeType: 'nonMinting',
    srcChain,
    dstChain,
    transferTypeStats: undefined,
    transferCount,
    transfersWithDurationCount: transferCount,
    identifiedCount: transferCount,
    totalDurationSum: 0,
    srcValueUsd: undefined,
    dstValueUsd: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    avgValueInFlight: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    countUnder100: 0,
    count100To1K: 0,
    count1KTo10K: 0,
    count10KTo100K: 0,
    countOver100K: 0,
    ...overrides,
  }
}

export function aggregatedToken(
  id: string,
  srcChain: string,
  dstChain: string,
  timestamp: UnixTime,
  transferCount: number,
  overrides: Partial<AggregatedInteropTokenRecord> = {},
): AggregatedInteropTokenRecord {
  return {
    timestamp,
    id,
    bridgeType: 'nonMinting',
    srcChain,
    dstChain,
    abstractTokenId: 'eth',
    transferTypeStats: undefined,
    transferCount,
    transfersWithDurationCount: transferCount,
    totalDurationSum: 0,
    volume: 0,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
    ...overrides,
  }
}
