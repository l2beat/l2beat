import { assertUnreachable, getInteropTransferValue } from '@l2beat/shared-pure'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
} from '../types'
import { accumulateChains, accumulateTokens } from './accumulate'
import { mergeTransferTypeStats } from './mergeTransferTypeStats'

export interface ProtocolDataByBridgeType {
  lockAndMint?: ProtocolDataByBridgeTypeCommon & CommonInteropData
  nonMinting?: {
    averageValueInFlight: number
  } & ProtocolDataByBridgeTypeCommon
  burnAndMint?: ProtocolDataByBridgeTypeCommon
}

type ProtocolDataByBridgeTypeCommon = {
  volume: number
  tokens: Map<string, CommonInteropData>
  transferCount: number
  identifiedTransferCount: number
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
}

export interface ProtocolData extends CommonInteropData {
  volume: number
  tokens: Map<string, CommonInteropData>
  chains: Map<string, CommonInteropData>
  minTransferValueUsd: number | undefined
  maxTransferValueUsd: number | undefined
  averageValueInFlight: number | undefined
  identifiedTransferCount: number
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

export const INITIAL_COMMON_INTEROP_DATA: CommonInteropData = {
  volume: 0,
  transferCount: 0,
  totalDurationSum: 0,
  transferTypeStats: undefined,
  minTransferValueUsd: undefined,
  maxTransferValueUsd: undefined,
  mintedValueUsd: undefined,
  burnedValueUsd: undefined,
}

/**
 * Returns a two-level map: projectId -> bridgeType -> ProtocolData
 * Used by getProtocolEntries where we need separate entries per bridge type.
 */
export function getProtocolsDataMapByBridgeType(
  records: AggregatedInteropTransferWithTokens[],
): Map<string, ProtocolDataByBridgeType> {
  const protocolsDataMap = new Map<string, ProtocolDataByBridgeType>()

  for (const record of records) {
    if (record.bridgeType === 'unknown') continue

    const bridgeTypeMap = protocolsDataMap.get(record.id) ?? {
      lockAndMint: undefined,
      nonMinting: undefined,
      burnAndMint: undefined,
    }
    switch (record.bridgeType) {
      case 'lockAndMint':
        bridgeTypeMap.lockAndMint = {
          volume:
            (bridgeTypeMap.lockAndMint?.volume ?? 0) +
            (getInteropTransferValue(record) ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.lockAndMint?.tokens,
            record.tokens,
          ),
          transferCount:
            (bridgeTypeMap.lockAndMint?.transferCount ?? 0) +
            record.transferCount,
          identifiedTransferCount:
            (bridgeTypeMap.lockAndMint?.identifiedTransferCount ?? 0) +
            record.identifiedCount,
          totalDurationSum:
            (bridgeTypeMap.lockAndMint?.totalDurationSum ?? 0) +
            (record.totalDurationSum ?? 0),
          transferTypeStats: mergeTransferTypeStats(
            bridgeTypeMap.lockAndMint?.transferTypeStats,
            record.transferTypeStats,
          ),
          minTransferValueUsd:
            record.minTransferValueUsd !== undefined
              ? Math.min(
                  bridgeTypeMap.lockAndMint?.minTransferValueUsd ??
                    Number.POSITIVE_INFINITY,
                  record.minTransferValueUsd,
                )
              : bridgeTypeMap.lockAndMint?.minTransferValueUsd,
          maxTransferValueUsd:
            record.maxTransferValueUsd !== undefined
              ? Math.max(
                  bridgeTypeMap.lockAndMint?.maxTransferValueUsd ??
                    Number.NEGATIVE_INFINITY,
                  record.maxTransferValueUsd,
                )
              : bridgeTypeMap.lockAndMint?.maxTransferValueUsd,

          mintedValueUsd:
            (bridgeTypeMap.lockAndMint?.mintedValueUsd ?? 0) +
            (record.mintedValueUsd ?? 0),
          burnedValueUsd:
            (bridgeTypeMap.lockAndMint?.burnedValueUsd ?? 0) +
            (record.burnedValueUsd ?? 0),
        }
        break
      case 'nonMinting':
        bridgeTypeMap.nonMinting = {
          volume:
            (bridgeTypeMap.nonMinting?.volume ?? 0) +
            (getInteropTransferValue(record) ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.nonMinting?.tokens,
            record.tokens,
          ),
          transferCount:
            (bridgeTypeMap.nonMinting?.transferCount ?? 0) +
            record.transferCount,
          identifiedTransferCount:
            (bridgeTypeMap.nonMinting?.identifiedTransferCount ?? 0) +
            record.identifiedCount,
          minTransferValueUsd:
            record.minTransferValueUsd !== undefined
              ? Math.min(
                  bridgeTypeMap.nonMinting?.minTransferValueUsd ??
                    Number.POSITIVE_INFINITY,
                  record.minTransferValueUsd,
                )
              : bridgeTypeMap.nonMinting?.minTransferValueUsd,
          maxTransferValueUsd:
            record.maxTransferValueUsd !== undefined
              ? Math.max(
                  bridgeTypeMap.nonMinting?.maxTransferValueUsd ??
                    Number.NEGATIVE_INFINITY,
                  record.maxTransferValueUsd,
                )
              : bridgeTypeMap.nonMinting?.maxTransferValueUsd,
          averageValueInFlight:
            (bridgeTypeMap.nonMinting?.averageValueInFlight ?? 0) +
            (record.avgValueInFlight ?? 0),
        }
        break
      case 'burnAndMint':
        bridgeTypeMap.burnAndMint = {
          volume:
            (bridgeTypeMap.burnAndMint?.volume ?? 0) +
            (getInteropTransferValue(record) ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.burnAndMint?.tokens,
            record.tokens,
          ),
          transferCount:
            (bridgeTypeMap.burnAndMint?.transferCount ?? 0) +
            record.transferCount,
          identifiedTransferCount:
            (bridgeTypeMap.burnAndMint?.identifiedTransferCount ?? 0) +
            record.identifiedCount,
          minTransferValueUsd:
            record.minTransferValueUsd !== undefined
              ? Math.min(
                  bridgeTypeMap.burnAndMint?.minTransferValueUsd ??
                    Number.POSITIVE_INFINITY,
                  record.minTransferValueUsd,
                )
              : bridgeTypeMap.burnAndMint?.minTransferValueUsd,
          maxTransferValueUsd:
            record.maxTransferValueUsd !== undefined
              ? Math.max(
                  bridgeTypeMap.burnAndMint?.maxTransferValueUsd ??
                    Number.NEGATIVE_INFINITY,
                  record.maxTransferValueUsd,
                )
              : bridgeTypeMap.burnAndMint?.maxTransferValueUsd,
        }
        break
      default:
        assertUnreachable(record.bridgeType)
    }
    protocolsDataMap.set(record.id, bridgeTypeMap)
  }

  return protocolsDataMap
}

/**
 * Returns a flat map: projectId -> ProtocolData (aggregated across all bridge types)
 * Used by getAllProtocolEntries where we aggregate all bridge types together.
 */
export function getProtocolsDataMap(
  records: AggregatedInteropTransferWithTokens[],
): Map<string, ProtocolData> {
  const protocolsDataMap = new Map<string, ProtocolData>()

  for (const record of records) {
    const current =
      protocolsDataMap.get(record.id) ?? createInitialProtocolData()
    protocolsDataMap.set(record.id, {
      volume: current.volume + (getInteropTransferValue(record) ?? 0),
      tokens: mergeTokensData(current.tokens, record.tokens),
      chains: mergeChainsData(current.chains, record),
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
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
      averageValueInFlight:
        record.avgValueInFlight !== undefined
          ? (current.averageValueInFlight ?? 0) + record.avgValueInFlight
          : current.averageValueInFlight,
      identifiedTransferCount:
        current.identifiedTransferCount + (record.identifiedCount ?? 0),
      mintedValueUsd:
        record.mintedValueUsd !== undefined
          ? (current.mintedValueUsd ?? 0) + record.mintedValueUsd
          : current.mintedValueUsd,
      burnedValueUsd:
        record.burnedValueUsd !== undefined
          ? (current.burnedValueUsd ?? 0) + record.burnedValueUsd
          : current.burnedValueUsd,
    })
  }

  return protocolsDataMap
}

function createInitialProtocolData(): ProtocolData {
  return {
    volume: 0,
    tokens: new Map<string, CommonInteropData>(),
    chains: new Map<string, CommonInteropData>(),
    transferCount: 0,
    totalDurationSum: 0,
    transferTypeStats: undefined,
    minTransferValueUsd: undefined,
    maxTransferValueUsd: undefined,
    averageValueInFlight: undefined,
    identifiedTransferCount: 0,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
  }
}

function mergeTokensData(
  currentTokens: Map<string, CommonInteropData> | undefined,
  recordTokens: AggregatedInteropTransferWithTokens['tokens'],
): Map<string, CommonInteropData> {
  const result = new Map(currentTokens)

  for (const token of recordTokens) {
    const current =
      result.get(token.abstractTokenId) ?? INITIAL_COMMON_INTEROP_DATA
    result.set(token.abstractTokenId, accumulateTokens(current, token))
  }

  return result
}

function mergeChainsData(
  currentChains: Map<string, CommonInteropData>,
  record: AggregatedInteropTransferWithTokens,
): Map<string, CommonInteropData> {
  const result = new Map(currentChains)

  // Source chain: transfers go OUT
  const srcChain = result.get(record.srcChain) ?? INITIAL_COMMON_INTEROP_DATA
  result.set(record.srcChain, accumulateChains(srcChain, record, 'src'))

  // Destination chain: transfers come IN (only if different from source)
  if (record.dstChain !== record.srcChain) {
    const dstChain = result.get(record.dstChain) ?? INITIAL_COMMON_INTEROP_DATA
    result.set(record.dstChain, accumulateChains(dstChain, record, 'dst'))
  }

  return result
}
