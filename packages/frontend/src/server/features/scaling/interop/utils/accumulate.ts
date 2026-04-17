import type {
  AggregatedInteropTokensPairRecord,
  AggregatedInteropTransferRecord,
} from '@l2beat/database'
import { manifest } from '~/utils/Manifest'
import { INTEROP_PAIR_SEPARATOR } from '../consts'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
} from '../types'
import type { TokenInteropData } from './buildTokensDataMap'
import { getInteropChains } from './getInteropChains'
import { mergeTransferTypeStats } from './mergeTransferTypeStats'

export const INITIAL_COMMON_INTEROP_DATA: CommonInteropData = {
  volume: 0,
  transferCount: 0,
  transfersWithDurationCount: 0,
  totalDurationSum: 0,
  transferTypeStats: undefined,
  minTransferValueUsd: undefined,
  maxTransferValueUsd: undefined,
  mintedValueUsd: undefined,
  burnedValueUsd: undefined,
}

const chainIconMap = new Map(
  getInteropChains().map((chain) => [
    chain.id,
    manifest.getUrl(`/icons/${chain.iconSlug ?? chain.id}.png`),
  ]),
)

export function accumulateTokens(
  current: TokenInteropData,
  token: AggregatedInteropTransferWithTokens['tokens'][number],
  chainInfo: { protocolId: string; srcChain: string; dstChain: string },
) {
  const result = {
    ...accumulate(current, token),
    flows: current.flows,
    protocols: current.protocols,
  }

  const flowKey = `${chainInfo.srcChain}${INTEROP_PAIR_SEPARATOR}${chainInfo.dstChain}`
  const currentFlow = current.flows.get(flowKey)
  if (currentFlow) {
    currentFlow.volume += token.volume
  } else {
    current.flows.set(flowKey, {
      srcChain: {
        id: chainInfo.srcChain,
        iconUrl: chainIconMap.get(chainInfo.srcChain),
      },
      dstChain: {
        id: chainInfo.dstChain,
        iconUrl: chainIconMap.get(chainInfo.dstChain),
      },
      volume: token.volume,
    })
  }

  const currentProtocol = current.protocols.get(chainInfo.protocolId)
  if (currentProtocol) {
    current.protocols.set(
      chainInfo.protocolId,
      (currentProtocol ?? 0) + token.volume,
    )
  } else {
    current.protocols.set(chainInfo.protocolId, token.volume)
  }

  return result
}

export function accumulateTokensPairs(
  current: CommonInteropData,
  pair: AggregatedInteropTokensPairRecord,
) {
  return accumulate(current, {
    ...pair,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
  })
}

export function accumulateChains(
  current: CommonInteropData,
  record: AggregatedInteropTransferRecord,
  source: 'src' | 'dst',
) {
  return accumulate(current, {
    volume: source === 'src' ? record.srcValueUsd : record.dstValueUsd,
    transferCount: record.transferCount,
    transfersWithDurationCount: record.transfersWithDurationCount,
    totalDurationSum: record.totalDurationSum,
    minTransferValueUsd: record.minTransferValueUsd,
    maxTransferValueUsd: record.maxTransferValueUsd,
    mintedValueUsd: record.mintedValueUsd,
    burnedValueUsd: record.burnedValueUsd,
    transferTypeStats: record.transferTypeStats,
  })
}

function accumulate(
  current: CommonInteropData,
  record: {
    volume: number | undefined
    transferCount: number | undefined
    transfersWithDurationCount: number | undefined
    totalDurationSum: number | undefined
    minTransferValueUsd: number | undefined
    maxTransferValueUsd: number | undefined
    mintedValueUsd: number | undefined
    burnedValueUsd: number | undefined
    transferTypeStats: AggregatedInteropTransferRecord['transferTypeStats']
  },
) {
  const transferCount = record.transferCount ?? 0
  const transfersWithDurationCount = record.transfersWithDurationCount ?? 0
  const durationSum = record.totalDurationSum ?? 0

  return {
    volume: current.volume + (record.volume ?? 0),
    transferCount: current.transferCount + transferCount,
    transfersWithDurationCount:
      current.transfersWithDurationCount + transfersWithDurationCount,
    totalDurationSum: current.totalDurationSum + durationSum,
    transferTypeStats: mergeTransferTypeStats(
      current.transferTypeStats,
      record.transferTypeStats,
    ),
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
  }
}
