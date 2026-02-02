import type { InteropConfig } from '@l2beat/config'
import type {
  AggregatedInteropTransferWithTokens,
  AverageDurationData,
} from '../types'

interface ProtocolData extends AverageDurationData {
  volume: number
  tokens: Map<string, AverageDurationData & { volume: number }>
  chains: Map<string, AverageDurationData & { volume: number }>
  averageValueInFlight: number | undefined
}

const INITIAL_DATA: AverageDurationData & { volume: number } = {
  volume: 0,
  transferCount: 0,
  totalDurationSum: 0,
  inTransferCount: 0,
  inDurationSum: 0,
  outTransferCount: 0,
  outDurationSum: 0,
}

export function getProtocolsDataMap(
  records: AggregatedInteropTransferWithTokens[],
  durationSplitMap: Map<string, NonNullable<InteropConfig['durationSplit']>>,
) {
  const protocolsDataMap = new Map<string, ProtocolData>()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      volume: 0,
      tokens: new Map<string, AverageDurationData & { volume: number }>(),
      chains: new Map<string, AverageDurationData & { volume: number }>(),
      transferCount: 0,
      totalDurationSum: 0,
      inTransferCount: 0,
      inDurationSum: 0,
      outTransferCount: 0,
      outDurationSum: 0,
      averageValueInFlight: undefined,
    }

    const durationSplit = durationSplitMap.get(record.id)
    const direction = getDirection(record, durationSplit)

    for (const token of record.tokens) {
      const currentToken = current.tokens.get(token.abstractTokenId)
      const tokenDurationSplits = updateDurationSplits(
        currentToken ?? INITIAL_DATA,
        direction,
        token.transferCount ?? 0,
        token.totalDurationSum ?? 0,
      )

      current.tokens.set(token.abstractTokenId, {
        transferCount:
          (currentToken?.transferCount ?? 0) + (token.transferCount ?? 0),
        totalDurationSum:
          (currentToken?.totalDurationSum ?? 0) + (token.totalDurationSum ?? 0),
        volume: (currentToken?.volume ?? 0) + (token.volume ?? 0),
        ...tokenDurationSplits,
      })
    }

    updateChainData(current.chains, record)

    const protocolDurationSplits = updateDurationSplits(
      current,
      direction,
      record.transferCount ?? 0,
      record.totalDurationSum ?? 0,
    )

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: current.tokens,
      chains: current.chains,
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
      ...protocolDurationSplits,
      averageValueInFlight:
        record.avgValueInFlight !== undefined
          ? (current.averageValueInFlight ?? 0) + record.avgValueInFlight
          : current.averageValueInFlight,
    })
  }

  return protocolsDataMap
}

function getDirection(
  record: { srcChain: string; dstChain: string },
  durationSplit: NonNullable<InteropConfig['durationSplit']> | undefined,
): 'in' | 'out' | null {
  if (!durationSplit) return null
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

function updateDurationSplits(
  current: AverageDurationData,
  direction: 'in' | 'out' | null,
  transferCount: number,
  durationSum: number,
): Pick<
  AverageDurationData,
  'inTransferCount' | 'inDurationSum' | 'outTransferCount' | 'outDurationSum'
> {
  let inTransferCount = current.inTransferCount
  let inDurationSum = current.inDurationSum
  let outTransferCount = current.outTransferCount
  let outDurationSum = current.outDurationSum

  if (direction === 'in') {
    inTransferCount += transferCount
    inDurationSum += durationSum
  } else if (direction === 'out') {
    outTransferCount += transferCount
    outDurationSum += durationSum
  }

  return {
    inTransferCount,
    inDurationSum,
    outTransferCount,
    outDurationSum,
  }
}

function updateChainData(
  chains: Map<string, AverageDurationData & { volume: number }>,
  record: AggregatedInteropTransferWithTokens,
): void {
  const srcChain = chains.get(record.srcChain) ?? INITIAL_DATA
  chains.set(record.srcChain, {
    volume: srcChain.volume + (record.srcValueUsd ?? 0),
    inDurationSum: srcChain.inDurationSum,
    outDurationSum: srcChain.outDurationSum + (record.totalDurationSum ?? 0),
    inTransferCount: srcChain.inTransferCount,
    outTransferCount: srcChain.outTransferCount + (record.transferCount ?? 0),
    transferCount: srcChain.transferCount + (record.transferCount ?? 0),
    totalDurationSum:
      srcChain.totalDurationSum + (record.totalDurationSum ?? 0),
  })

  if (record.dstChain !== record.srcChain) {
    const dstChain = chains.get(record.dstChain) ?? INITIAL_DATA
    chains.set(record.dstChain, {
      volume: dstChain.volume + (record.dstValueUsd ?? 0),
      inDurationSum: dstChain.inDurationSum + (record.totalDurationSum ?? 0),
      outDurationSum: dstChain.outDurationSum,
      inTransferCount: dstChain.inTransferCount + (record.transferCount ?? 0),
      outTransferCount: dstChain.outTransferCount,
      transferCount: dstChain.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        dstChain.totalDurationSum + (record.totalDurationSum ?? 0),
    })
  }
}
