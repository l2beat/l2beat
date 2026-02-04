import type { InteropConfig } from '@l2beat/config'
import type {
  AggregatedInteropTransferWithTokens,
  CommonInteropData,
} from '../types'

interface ProtocolData extends CommonInteropData {
  volume: number
  tokens: Map<string, CommonInteropData>
  chains: Map<string, CommonInteropData>
  averageValueInFlight: number | undefined
  identifiedTransferCount: number
  mintedValueUsd: number | undefined
  burnedValueUsd: number | undefined
}

const INITIAL_DATA: CommonInteropData = {
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

export function getProtocolsDataMap(
  records: AggregatedInteropTransferWithTokens[],
  durationSplitMap: Map<
    string,
    NonNullable<
      InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
    >
  >,
) {
  const protocolsDataMap = new Map<string, ProtocolData>()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      tokens: new Map<string, CommonInteropData & { volume: number }>(),
      chains: new Map(),
      ...INITIAL_DATA,
      averageValueInFlight: undefined,
      identifiedTransferCount: 0,
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
        mintedValueUsd: currentToken?.mintedValueUsd,
        burnedValueUsd: currentToken?.burnedValueUsd,
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

function getDirection(
  record: { srcChain: string; dstChain: string },
  durationSplit:
    | NonNullable<
        InteropConfig['durationSplit'] | InteropConfig['transfersTimeMode']
      >
    | undefined,
): 'in' | 'out' | null {
  if (!durationSplit || durationSplit === 'unknown') return null

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
  current: CommonInteropData,
  direction: 'in' | 'out' | null,
  transferCount: number,
  durationSum: number,
): Pick<
  CommonInteropData,
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
  chains: ProtocolData['chains'],
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
    mintedValueUsd: srcChain.mintedValueUsd,
    burnedValueUsd:
      srcChain.burnedValueUsd !== undefined
        ? srcChain.burnedValueUsd + (record.burnedValueUsd ?? 0)
        : record.burnedValueUsd,
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
      burnedValueUsd: dstChain.burnedValueUsd,
      mintedValueUsd:
        dstChain.mintedValueUsd !== undefined
          ? dstChain.mintedValueUsd + (record.mintedValueUsd ?? 0)
          : record.mintedValueUsd,
    })
  }
}
