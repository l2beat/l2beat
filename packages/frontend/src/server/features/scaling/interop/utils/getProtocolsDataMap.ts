import type { InteropDurationSplit } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared-pure'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
  DurationSplitMap,
} from '../types'
import { accumulateChains, accumulateTokens } from './accumulate'
import type { TransfersTimeModeMap } from './buildTransfersTimeModeMap'
import { computeDurationSplits } from './computeDurationSplits'

export interface ProtocolDataByBridgeType {
  lockAndMint?: ProtocolDataByBridgeTypeCommon & CommonInteropData
  nonMinting?: {
    averageValueInFlight: number
  } & ProtocolDataByBridgeTypeCommon
  omnichain?: ProtocolDataByBridgeTypeCommon
}

type ProtocolDataByBridgeTypeCommon = {
  volume: number
  tokens: Map<string, CommonInteropData>
  transferCount: number
  identifiedTransferCount: number
}

export interface ProtocolData extends CommonInteropData {
  volume: number
  tokens: Map<string, CommonInteropData>
  chains: Map<string, CommonInteropData>
  averageValueInFlight: number | undefined
  identifiedTransferCount: number
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

export const INITIAL_COMMON_INTEROP_DATA: CommonInteropData = {
  volume: 0,
  transferCount: 0,
  totalDurationSum: 0,
  inTransferCount: 0,
  inDurationSum: 0,
  outTransferCount: 0,
  outDurationSum: 0,
  mintedValueUsd: undefined,
  burnedValueUsd: undefined,
}

/**
 * Returns a two-level map: projectId -> bridgeType -> ProtocolData
 * Used by getProtocolEntries where we need separate entries per bridge type.
 */
export function getProtocolsDataMapByBridgeType(
  records: AggregatedInteropTransferWithTokens[],
  durationSplitMap: DurationSplitMap | undefined,
  transfersTimeModeMap: TransfersTimeModeMap,
): Map<string, ProtocolDataByBridgeType> {
  const protocolsDataMap = new Map<string, ProtocolDataByBridgeType>()

  for (const record of records) {
    if (record.bridgeType === 'unknown') continue

    const bridgeTypeMap = protocolsDataMap.get(record.id) ?? {
      lockAndMint: undefined,
      nonMinting: undefined,
      omnichain: undefined,
    }

    const durationSplit = durationSplitMap
      ?.get(record.id)
      ?.get(record.bridgeType)
    const transfersTimeMode = transfersTimeModeMap.get(record.id)
    const direction = getDirection(record, durationSplit, transfersTimeMode)

    switch (record.bridgeType) {
      case 'lockAndMint':
        bridgeTypeMap.lockAndMint = {
          volume:
            (bridgeTypeMap.lockAndMint?.volume ?? 0) +
            (record.srcValueUsd ?? record.dstValueUsd ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.lockAndMint?.tokens,
            record.tokens,
            direction,
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

          mintedValueUsd:
            (bridgeTypeMap.lockAndMint?.mintedValueUsd ?? 0) +
            (record.mintedValueUsd ?? 0),
          burnedValueUsd:
            (bridgeTypeMap.lockAndMint?.burnedValueUsd ?? 0) +
            (record.burnedValueUsd ?? 0),
          ...computeDurationSplits(
            bridgeTypeMap.lockAndMint ?? INITIAL_COMMON_INTEROP_DATA,
            direction,
            record,
          ),
        }
        break
      case 'nonMinting':
        bridgeTypeMap.nonMinting = {
          volume:
            (bridgeTypeMap.nonMinting?.volume ?? 0) +
            (record.srcValueUsd ?? record.dstValueUsd ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.nonMinting?.tokens,
            record.tokens,
            direction,
          ),
          transferCount:
            (bridgeTypeMap.nonMinting?.transferCount ?? 0) +
            record.transferCount,
          identifiedTransferCount:
            (bridgeTypeMap.nonMinting?.identifiedTransferCount ?? 0) +
            record.identifiedCount,
          averageValueInFlight:
            (bridgeTypeMap.nonMinting?.averageValueInFlight ?? 0) +
            (record.avgValueInFlight ?? 0),
        }
        break
      case 'omnichain':
        bridgeTypeMap.omnichain = {
          volume:
            (bridgeTypeMap.omnichain?.volume ?? 0) +
            (record.srcValueUsd ?? record.dstValueUsd ?? 0),
          tokens: mergeTokensData(
            bridgeTypeMap.omnichain?.tokens,
            record.tokens,
            direction,
          ),
          transferCount:
            (bridgeTypeMap.omnichain?.transferCount ?? 0) +
            record.transferCount,
          identifiedTransferCount:
            (bridgeTypeMap.omnichain?.identifiedTransferCount ?? 0) +
            record.identifiedCount,
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
  transfersTimeModeMap: TransfersTimeModeMap,
  durationSplitMap: DurationSplitMap | undefined,
): Map<string, ProtocolData> {
  const protocolsDataMap = new Map<string, ProtocolData>()

  for (const record of records) {
    const current =
      protocolsDataMap.get(record.id) ?? createInitialProtocolData()

    const transfersTimeMode = transfersTimeModeMap.get(record.id)
    const durationSplit =
      record.bridgeType !== 'unknown'
        ? durationSplitMap?.get(record.id)?.get(record.bridgeType)
        : undefined
    const direction = getDirection(record, durationSplit, transfersTimeMode)

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: mergeTokensData(current.tokens, record.tokens, direction),
      chains: mergeChainsData(current.chains, record),
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
      ...computeDurationSplits(current, direction, record),
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
    inTransferCount: 0,
    inDurationSum: 0,
    outTransferCount: 0,
    outDurationSum: 0,
    averageValueInFlight: undefined,
    identifiedTransferCount: 0,
    mintedValueUsd: undefined,
    burnedValueUsd: undefined,
  }
}

export function getDirection(
  record: { srcChain: string; dstChain: string },
  durationSplit: InteropDurationSplit | undefined,
  transfersTimeMode: 'unknown' | undefined,
): 'in' | 'out' | null {
  if (!durationSplit || transfersTimeMode === 'unknown') return null

  if (
    record.srcChain === durationSplit.in.from &&
    record.dstChain === durationSplit.in.to
  ) {
    return 'in'
  }
  if (
    record.srcChain === durationSplit.out.from &&
    record.dstChain === durationSplit.out.to
  ) {
    return 'out'
  }
  return null
}

function mergeTokensData(
  currentTokens: Map<string, CommonInteropData> | undefined,
  recordTokens: AggregatedInteropTransferWithTokens['tokens'],
  direction: 'in' | 'out' | null,
): Map<string, CommonInteropData> {
  const result = new Map(currentTokens)

  for (const token of recordTokens) {
    const current =
      result.get(token.abstractTokenId) ?? INITIAL_COMMON_INTEROP_DATA
    result.set(
      token.abstractTokenId,
      accumulateTokens(current, token, direction),
    )
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
