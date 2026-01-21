import type { InteropConfig } from '@l2beat/config'
import type { AggregatedInteropTransferRecord } from '@l2beat/database'

export function getProtocolsDataMap(
  records: AggregatedInteropTransferRecord[],
  durationSplitMap: Map<string, NonNullable<InteropConfig['durationSplit']>>,
) {
  const protocolsDataMap = new Map<
    string,
    {
      volume: number
      tokens: Map<string, number>
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
      tokens: new Map<string, number>(),
      transferCount: 0,
      totalDurationSum: 0,
      inTransferCount: 0,
      inDurationSum: 0,
      outTransferCount: 0,
      outDurationSum: 0,
    }

    for (const [tokenId, volume] of Object.entries(record.tokensByVolume)) {
      current.tokens.set(tokenId, (current.tokens.get(tokenId) ?? 0) + volume)
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
