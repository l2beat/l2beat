import type {
  Database,
  InteropMessageDetailedStatsRecord,
  InteropMessageRecord,
  InteropMessageStatsRecord,
} from '@l2beat/database'

export interface InteropMessageDetailsRecord {
  plugin: string
  messageId: string
  type: string
  app: string
  duration: number | undefined
  timestamp: number
  srcTime: number | undefined
  srcChain: string | undefined
  srcTxHash: string | undefined
  srcLogIndex: number | undefined
  srcEventId: string | undefined
  dstTime: number | undefined
  dstChain: string | undefined
  dstTxHash: string | undefined
  dstLogIndex: number | undefined
  dstEventId: string | undefined
}

export interface InteropMessageFilters {
  plugin?: string
  srcChain?: string
  dstChain?: string
}

export interface InteropMessageStatsItem extends InteropMessageStatsRecord {
  chains: InteropMessageDetailedStatsRecord[]
}

export async function getInteropMessageDetails(
  db: Database,
  type: string,
  filters: InteropMessageFilters = {},
): Promise<InteropMessageDetailsRecord[]> {
  const messages = await db.interopMessage.getByType(type, filters)

  return messages.map((message) => toDetailsRecord(message))
}

export async function getInteropMessageStats(
  db: Database,
): Promise<InteropMessageStatsItem[]> {
  const [stats, detailedStats] = await Promise.all([
    db.interopMessage.getStats(),
    db.interopMessage.getDetailedStats(),
  ])

  const chainsByMessage = new Map<string, InteropMessageDetailedStatsRecord[]>()

  for (const chain of detailedStats) {
    const key = `${chain.plugin}:${chain.type}`
    const chains = chainsByMessage.get(key) ?? []

    chains.push(chain)
    chainsByMessage.set(key, chains)
  }

  return stats.map((overall) => {
    const key = `${overall.plugin}:${overall.type}`

    return {
      ...overall,
      chains: chainsByMessage.get(key) ?? [],
    }
  })
}

function toDetailsRecord(
  message: InteropMessageRecord,
): InteropMessageDetailsRecord {
  return {
    plugin: message.plugin,
    messageId: message.messageId,
    type: message.type,
    app: message.app,
    duration: message.duration,
    timestamp: message.timestamp,
    srcTime: message.srcTime,
    srcChain: message.srcChain,
    srcTxHash: message.srcTxHash,
    srcLogIndex: message.srcLogIndex,
    srcEventId: message.srcEventId,
    dstTime: message.dstTime,
    dstChain: message.dstChain,
    dstTxHash: message.dstTxHash,
    dstLogIndex: message.dstLogIndex,
    dstEventId: message.dstEventId,
  }
}
