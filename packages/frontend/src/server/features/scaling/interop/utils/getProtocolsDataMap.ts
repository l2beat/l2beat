import type { InteropDurationSplit } from '@l2beat/config'
import { type InteropBridgeType, unique } from '@l2beat/shared-pure'
import type {
  AggregatedInteropTransferWithTokens,
  AverageDurationData,
  DurationSplitMap,
} from '../types'

type TokensAndChainsData = AverageDurationData & { volume: number }

export interface ProtocolData extends AverageDurationData {
  bridgeTypes: InteropBridgeType[]
  volume: number
  tokens: Map<string, TokensAndChainsData>
  chains: Map<string, TokensAndChainsData>
  averageValueInFlight: number | undefined
  identifiedTransferCount: number
}

const INITIAL_DATA: TokensAndChainsData = {
  volume: 0,
  transferCount: 0,
  totalDurationSum: 0,
  inTransferCount: 0,
  inDurationSum: 0,
  outTransferCount: 0,
  outDurationSum: 0,
}

/**
 * Returns a two-level map: projectId -> bridgeType -> ProtocolData
 * Used by getProtocolEntries where we need separate entries per bridge type.
 */
export function getProtocolsDataMapByBridgeType(
  records: AggregatedInteropTransferWithTokens[],
  durationSplitMap: DurationSplitMap | undefined,
  transfersTimeModeMap: Map<string, 'unknown'>,
): Map<string, Map<InteropBridgeType, ProtocolData>> {
  const protocolsDataMap = new Map<
    string,
    Map<InteropBridgeType, ProtocolData>
  >()

  for (const record of records) {
    let bridgeTypeMap = protocolsDataMap.get(record.id)
    if (!bridgeTypeMap) {
      bridgeTypeMap = new Map()
      protocolsDataMap.set(record.id, bridgeTypeMap)
    }

    const current =
      bridgeTypeMap.get(record.bridgeType) ?? createInitialProtocolData()

    const durationSplit = durationSplitMap
      ?.get(record.id)
      ?.get(record.bridgeType)
    const transfersTimeMode = transfersTimeModeMap.get(record.id)
    const direction = getDirection(record, durationSplit, transfersTimeMode)

    bridgeTypeMap.set(record.bridgeType, {
      bridgeTypes: unique([...current.bridgeTypes, record.bridgeType]),
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
    })
  }

  return protocolsDataMap
}

/**
 * Returns a flat map: projectId -> ProtocolData (aggregated across all bridge types)
 * Used by getAllProtocolEntries where we aggregate all bridge types together.
 */
export function getProtocolsDataMap(
  records: AggregatedInteropTransferWithTokens[],
  transfersTimeModeMap: Map<string, 'unknown'>,
): Map<string, ProtocolData> {
  const protocolsDataMap = new Map<string, ProtocolData>()

  for (const record of records) {
    const current =
      protocolsDataMap.get(record.id) ?? createInitialProtocolData()

    // No duration split for aggregated view
    const transfersTimeMode = transfersTimeModeMap.get(record.id)
    const direction = getDirection(record, undefined, transfersTimeMode)

    protocolsDataMap.set(record.id, {
      bridgeTypes: unique([...current.bridgeTypes, record.bridgeType]),
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
    })
  }

  return protocolsDataMap
}

function createInitialProtocolData(): ProtocolData {
  return {
    bridgeTypes: [],
    volume: 0,
    tokens: new Map<string, TokensAndChainsData>(),
    chains: new Map<string, TokensAndChainsData>(),
    transferCount: 0,
    totalDurationSum: 0,
    inTransferCount: 0,
    inDurationSum: 0,
    outTransferCount: 0,
    outDurationSum: 0,
    averageValueInFlight: undefined,
    identifiedTransferCount: 0,
  }
}

function getDirection(
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

function computeDurationSplits(
  current: AverageDurationData,
  direction: 'in' | 'out' | null,
  record: AggregatedInteropTransferWithTokens,
): Pick<
  AverageDurationData,
  'inTransferCount' | 'inDurationSum' | 'outTransferCount' | 'outDurationSum'
> {
  const transferCount = record.transferCount ?? 0
  const durationSum = record.totalDurationSum ?? 0

  return {
    inTransferCount:
      current.inTransferCount + (direction === 'in' ? transferCount : 0),
    inDurationSum:
      current.inDurationSum + (direction === 'in' ? durationSum : 0),
    outTransferCount:
      current.outTransferCount + (direction === 'out' ? transferCount : 0),
    outDurationSum:
      current.outDurationSum + (direction === 'out' ? durationSum : 0),
  }
}

type TokenRecord = {
  abstractTokenId: string
  transferCount: number | null
  totalDurationSum: number | null
  volume: number | null
}

function mergeTokensData(
  currentTokens: Map<string, TokensAndChainsData>,
  recordTokens: TokenRecord[],
  direction: 'in' | 'out' | null,
): Map<string, TokensAndChainsData> {
  const result = new Map(currentTokens)

  for (const token of recordTokens) {
    const current = result.get(token.abstractTokenId) ?? INITIAL_DATA
    const transferCount = token.transferCount ?? 0
    const durationSum = token.totalDurationSum ?? 0

    result.set(token.abstractTokenId, {
      volume: current.volume + (token.volume ?? 0),
      transferCount: current.transferCount + transferCount,
      totalDurationSum: current.totalDurationSum + durationSum,
      inTransferCount:
        current.inTransferCount + (direction === 'in' ? transferCount : 0),
      inDurationSum:
        current.inDurationSum + (direction === 'in' ? durationSum : 0),
      outTransferCount:
        current.outTransferCount + (direction === 'out' ? transferCount : 0),
      outDurationSum:
        current.outDurationSum + (direction === 'out' ? durationSum : 0),
    })
  }

  return result
}

function mergeChainsData(
  currentChains: Map<string, TokensAndChainsData>,
  record: AggregatedInteropTransferWithTokens,
): Map<string, TokensAndChainsData> {
  const result = new Map(currentChains)
  const transferCount = record.transferCount ?? 0
  const durationSum = record.totalDurationSum ?? 0

  // Source chain: transfers go OUT
  const srcChain = result.get(record.srcChain) ?? INITIAL_DATA
  result.set(record.srcChain, {
    volume: srcChain.volume + (record.srcValueUsd ?? 0),
    transferCount: srcChain.transferCount + transferCount,
    totalDurationSum: srcChain.totalDurationSum + durationSum,
    inTransferCount: srcChain.inTransferCount,
    inDurationSum: srcChain.inDurationSum,
    outTransferCount: srcChain.outTransferCount + transferCount,
    outDurationSum: srcChain.outDurationSum + durationSum,
  })

  // Destination chain: transfers come IN (only if different from source)
  if (record.dstChain !== record.srcChain) {
    const dstChain = result.get(record.dstChain) ?? INITIAL_DATA
    result.set(record.dstChain, {
      volume: dstChain.volume + (record.dstValueUsd ?? 0),
      transferCount: dstChain.transferCount + transferCount,
      totalDurationSum: dstChain.totalDurationSum + durationSum,
      inTransferCount: dstChain.inTransferCount + transferCount,
      inDurationSum: dstChain.inDurationSum + durationSum,
      outTransferCount: dstChain.outTransferCount,
      outDurationSum: dstChain.outDurationSum,
    })
  }

  return result
}
