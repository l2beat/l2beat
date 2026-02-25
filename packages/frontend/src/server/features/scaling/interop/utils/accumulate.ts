import type { AggregatedInteropTransferRecord } from '@l2beat/database'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
} from '../types'
import { computeDurationSplits } from './computeDurationSplits'

export const INITIAL_COMMON_INTEROP_DATA: CommonInteropData = {
  volume: 0,
  transferCount: 0,
  totalDurationSum: 0,
  inTransferCount: 0,
  inDurationSum: 0,
  outTransferCount: 0,
  outDurationSum: 0,
  minTransferValueUsd: undefined,
  maxTransferValueUsd: undefined,
  mintedValueUsd: undefined,
  burnedValueUsd: undefined,
}

export function accumulateTokens(
  current: CommonInteropData,
  token: AggregatedInteropTransferWithTokens['tokens'][number],
  direction: 'in' | 'out' | null,
) {
  return accumulate(current, token, direction)
}

export function accumulateChains(
  current: CommonInteropData,
  record: AggregatedInteropTransferRecord,
  source: 'src' | 'dst',
) {
  return accumulate(
    current,
    {
      volume: source === 'src' ? record.srcValueUsd : record.dstValueUsd,
      transferCount: record.transferCount,
      totalDurationSum: record.totalDurationSum,
      minTransferValueUsd: record.minTransferValueUsd,
      maxTransferValueUsd: record.maxTransferValueUsd,
      mintedValueUsd: record.mintedValueUsd,
      burnedValueUsd: record.burnedValueUsd,
    },
    source === 'src' ? 'out' : 'in',
  )
}

function accumulate(
  current: CommonInteropData,
  record: {
    volume: number | undefined
    transferCount: number | undefined
    totalDurationSum: number | undefined
    minTransferValueUsd: number | undefined
    maxTransferValueUsd: number | undefined
    mintedValueUsd: number | undefined
    burnedValueUsd: number | undefined
  },
  direction: 'in' | 'out' | null,
) {
  const transferCount = record.transferCount ?? 0
  const durationSum = record.totalDurationSum ?? 0

  return {
    volume: current.volume + (record.volume ?? 0),
    transferCount: current.transferCount + transferCount,
    totalDurationSum: current.totalDurationSum + durationSum,
    minTransferValueUsd:
      record.minTransferValueUsd !== undefined
        ? current.minTransferValueUsd !== undefined
          ? Math.min(current.minTransferValueUsd, record.minTransferValueUsd)
          : record.minTransferValueUsd
        : current.minTransferValueUsd,
    maxTransferValueUsd:
      record.maxTransferValueUsd !== undefined
        ? current.maxTransferValueUsd !== undefined
          ? Math.max(current.maxTransferValueUsd, record.maxTransferValueUsd)
          : record.maxTransferValueUsd
        : current.maxTransferValueUsd,
    mintedValueUsd:
      current.mintedValueUsd !== undefined
        ? current.mintedValueUsd + (record.mintedValueUsd ?? 0)
        : record.mintedValueUsd,
    burnedValueUsd:
      current.burnedValueUsd !== undefined
        ? current.burnedValueUsd + (record.burnedValueUsd ?? 0)
        : record.burnedValueUsd,
    ...computeDurationSplits(current, direction, record),
  }
}
