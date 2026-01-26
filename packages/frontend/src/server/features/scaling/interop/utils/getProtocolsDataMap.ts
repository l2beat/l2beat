import type { InteropConfig } from '@l2beat/config'
import type {
  AggregatedInteropTransferWithTokens,
  InteropGroupedData,
} from '../types'

export function getProtocolsDataMap(
  records: AggregatedInteropTransferWithTokens[],
  durationSplitMap: Map<string, NonNullable<InteropConfig['durationSplit']>>,
) {
  const protocolsDataMap = new Map<
    string,
    {
      volume: number
      tokens: Map<string, InteropGroupedData>
      chains: Map<string, InteropGroupedData>
      transferCount: number
      totalDurationSum: number
      // Split duration tracking (only used when durationSplit is configured)
      inTransferCount: number
      inDurationSum: number
      outTransferCount: number
      outDurationSum: number
    }
  >()

  for (const record of records) {
    const current = protocolsDataMap.get(record.id) ?? {
      volume: 0,
      tokens: new Map<string, InteropGroupedData>(),
      chains: new Map<string, InteropGroupedData>(),
      transferCount: 0,
      totalDurationSum: 0,
      inTransferCount: 0,
      inDurationSum: 0,
      outTransferCount: 0,
      outDurationSum: 0,
    }

    for (const token of record.tokens) {
      const currentToken = current.tokens.get(token.abstractTokenId)
      current.tokens.set(token.abstractTokenId, {
        transferCount: currentToken?.transferCount ?? 0 + token.transferCount,
        totalDurationSum:
          currentToken?.totalDurationSum ?? 0 + token.totalDurationSum,
        volume: currentToken?.volume ?? 0 + token.volume,
      })
    }

    if (record.srcChain) {
      const currentChain = current.chains.get(record.srcChain) ?? {
        volume: 0,
        transferCount: 0,
        totalDurationSum: 0,
      }
      current.chains.set(record.srcChain, {
        volume: currentChain.volume + (record.srcValueUsd ?? 0),
        transferCount: currentChain.transferCount + (record.transferCount ?? 0),
        totalDurationSum:
          currentChain.totalDurationSum + (record.totalDurationSum ?? 0),
      })
    }
    if (record.dstChain && record.dstChain !== record.srcChain) {
      const currentChain = current.chains.get(record.dstChain) ?? {
        volume: 0,
        transferCount: 0,
        totalDurationSum: 0,
      }
      current.chains.set(record.dstChain, {
        volume: currentChain.volume + (record.dstValueUsd ?? 0),
        transferCount: currentChain.transferCount + (record.transferCount ?? 0),
        totalDurationSum:
          currentChain.totalDurationSum + (record.totalDurationSum ?? 0),
      })
    }

    // Check if this record matches a durationSplit direction
    const durationSplit = durationSplitMap.get(record.id)
    let inTransferCount = current.inTransferCount
    let inDurationSum = current.inDurationSum
    let outTransferCount = current.outTransferCount
    let outDurationSum = current.outDurationSum

    if (durationSplit) {
      const isInDirection =
        record.srcChain === durationSplit.in.from &&
        record.dstChain === durationSplit.in.to
      const isOutDirection =
        record.srcChain === durationSplit.out.from &&
        record.dstChain === durationSplit.out.to

      if (isInDirection) {
        inTransferCount += record.transferCount ?? 0
        inDurationSum += record.totalDurationSum ?? 0
      } else if (isOutDirection) {
        outTransferCount += record.transferCount ?? 0
        outDurationSum += record.totalDurationSum ?? 0
      }
    }

    protocolsDataMap.set(record.id, {
      volume: current.volume + (record.srcValueUsd ?? record.dstValueUsd ?? 0),
      tokens: current.tokens,
      chains: current.chains,
      transferCount: current.transferCount + (record.transferCount ?? 0),
      totalDurationSum:
        current.totalDurationSum + (record.totalDurationSum ?? 0),
      inTransferCount,
      inDurationSum,
      outTransferCount,
      outDurationSum,
    })
  }

  return protocolsDataMap
}
