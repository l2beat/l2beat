import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropMessageRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  generateId,
  type InteropApproximateQuery,
  type InteropEvent,
  type InteropEventDb,
  type InteropEventQuery,
  type InteropEventType,
  type InteropMessage,
  type InteropPlugin,
  type InteropTransfer,
  type MatchResult,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'
import type { InteropTransferStream } from '../stream/InteropTransferStream'

export class InteropMatchingLoop extends TimeLoop {
  constructor(
    private store: InteropEventStore,
    private db: Database,
    private plugins: InteropPlugin[],
    private supportedChains: string[],
    protected logger: Logger,
    private transferStream: InteropTransferStream,
    private readonly intervalMs = 10_000,
  ) {
    super({ intervalMs })
    this.logger = logger.for(this)
  }

  async run() {
    const result = await match(
      this.store,
      (type) => this.store.getEvents(type),
      this.store.getEventTypes(),
      this.store.getEventCount(),
      this.plugins,
      this.supportedChains,
      this.logger,
    )

    const messageRecords = result.messages.map(toMessageRecord)
    const transferRecords = result.transfers.map(toTransferRecord)

    await this.db.transaction(async () => {
      if (result.matched.length > 0 || result.unsupported.length > 0) {
        await this.store.updateMatchedAndUnsupported({
          matched: result.matched,
          unsupported: result.unsupported,
        })
      }
      const messages = await this.db.interopMessage.insertMany(messageRecords)
      const transfers =
        await this.db.interopTransfer.insertMany(transferRecords)

      this.logger.info('Matching results saved', {
        messages,
        transfers,
      })
    })

    if (transferRecords.length > 0) {
      this.transferStream?.publishBulk(transferRecords, this.intervalMs)
    }
  }
}

export async function match(
  db: InteropEventDb,
  getEvents: (type: string) => InteropEvent[],
  eventTypes: string[],
  count: number,
  plugins: InteropPlugin[],
  supportedChains: string[],
  logger: Logger,
) {
  const start = Date.now()
  logger.info('Matching started', {
    plugins: plugins.length,
    events: count,
    chains: supportedChains.length,
  })

  const matched = new Set<InteropEvent>()
  const unsupported = new Set<InteropEvent>()
  const allMessages: InteropMessage[] = []
  const allTransfers: InteropTransfer[] = []
  const isExcluded = (event: InteropEvent) =>
    matched.has(event) || unsupported.has(event)
  const filteredDb = createFilteredDb(db, isExcluded)

  for (const plugin of plugins) {
    if (!plugin.matchTypes || !plugin.match) {
      continue
    }

    await new Promise((r) => setTimeout(r)) // Unblock event loop
    const start = Date.now()
    const stats = {
      events: 0,
      matchedEvents: 0,
      messages: 0,
      transfers: 0,
    }

    for (const type of plugin.matchTypes) {
      const events = getEvents(type.type)
      stats.events += events.length
      for (const event of events) {
        if (matched.has(event) || unsupported.has(event)) {
          continue
        }
        let result: MatchResult | undefined
        try {
          result = await plugin.match?.(event, filteredDb)
        } catch (e) {
          logger.error('Matching failed', e, {
            plugin: plugin.name,
            eventId: event.eventId,
            eventType: event.type,
            eventTxHash: event.ctx.txHash,
          })
        }
        if (!result) {
          continue
        }

        matched.add(event)
        for (const item of result) {
          if (item.kind === 'InteropMessage') {
            allMessages.push({ ...item, plugin: plugin.name })
            stats.messages++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matched.add(event)
            }
          } else if (item.kind === 'InteropTransfer') {
            allTransfers.push({ ...item, plugin: plugin.name })
            stats.transfers++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matched.add(event)
            }
          } else if (item.kind === 'InteropIgnore') {
            for (const event of item.events) {
              unsupported.add(event)
            }
          }
        }
      }
    }

    logger.info('Plugin executed', {
      name: plugin.name,
      duration: Date.now() - start,
      events: stats.events,
      matchedEvents: stats.matchedEvents,
      messages: stats.messages,
      transfers: stats.transfers,
    })
  }

  for (const type of eventTypes) {
    for (const event of getEvents(type)) {
      if (matched.has(event)) {
        continue
      }
      const $srcChain = (event.args as Record<string, unknown>).$srcChain
      if (
        typeof $srcChain === 'string' &&
        !supportedChains.includes($srcChain)
      ) {
        unsupported.add(event)
      }
      const $dstChain = (event.args as Record<string, unknown>).$dstChain
      if (
        typeof $dstChain === 'string' &&
        !supportedChains.includes($dstChain)
      ) {
        unsupported.add(event)
      }
    }
  }

  logger.info('Matching finished', {
    duration: Date.now() - start,
    plugins: plugins.length,
    events: count,
    chains: supportedChains.length,
    matchedEvents: matched.size,
    unsupportedEvents: unsupported.size,
    messages: allMessages.length,
    transfers: allTransfers.length,
  })

  return {
    matched: Array.from(matched),
    unsupported: Array.from(unsupported),
    messages: allMessages,
    transfers: allTransfers,
  }
}

function createFilteredDb(
  db: InteropEventDb,
  isExcluded: (event: InteropEvent) => boolean,
): InteropEventDb {
  const filterEvents = <T>(events: InteropEvent<T>[]) =>
    events.filter((event) => !isExcluded(event))

  return {
    find<T>(type: InteropEventType<T>, query: InteropEventQuery<T>) {
      return filterEvents(db.findAll(type, query))[0]
    },
    findAll<T>(type: InteropEventType<T>, query: InteropEventQuery<T>) {
      return filterEvents(db.findAll(type, query))
    },
    findApproximate<T>(
      type: InteropEventType<T>,
      query: InteropEventQuery<T>,
      approximate: InteropApproximateQuery<T>,
    ) {
      return filterEvents(db.findApproximate(type, query, approximate))
    },
  }
}

function toMessageRecord(message: InteropMessage): InteropMessageRecord {
  return {
    plugin: message.plugin,
    messageId: generateId('M'),
    type: message.type,
    app: message.app,
    duration: Math.max(
      message.dst.ctx.timestamp - message.src.ctx.timestamp,
      0,
    ),
    timestamp: Math.max(message.src.ctx.timestamp, message.dst.ctx.timestamp),

    srcChain: message.src.ctx.chain,
    srcTime: message.src.ctx.timestamp,
    srcEventId: message.src.eventId,
    srcLogIndex: message.src.ctx.logIndex,
    srcTxHash: message.src.ctx.txHash,

    dstChain: message.dst.ctx.chain,
    dstTime: message.dst.ctx.timestamp,
    dstEventId: message.dst.eventId,
    dstLogIndex: message.dst.ctx.logIndex,
    dstTxHash: message.dst.ctx.txHash,
  }
}

function toTransferRecord(transfer: InteropTransfer): InteropTransferRecord {
  return {
    plugin: transfer.plugin,
    transferId: generateId('T'),
    type: transfer.type,
    bridgeType: transfer.bridgeType,
    duration: Math.max(
      transfer.dst.event.ctx.timestamp - transfer.src.event.ctx.timestamp,
      0,
    ),
    timestamp: Math.max(
      transfer.src.event.ctx.timestamp,
      transfer.dst.event.ctx.timestamp,
    ),

    srcChain: transfer.src.event.ctx.chain,
    srcTime: transfer.src.event.ctx.timestamp,
    srcEventId: transfer.src.event.eventId,
    srcLogIndex: transfer.src.event.ctx.logIndex,
    srcTxHash: transfer.src.event.ctx.txHash,

    srcTokenAddress: transfer.src.tokenAddress,
    srcRawAmount: transfer.src.tokenAmount,
    srcWasBurned: transfer.src.wasBurned,
    srcSymbol: undefined,
    srcAbstractTokenId: undefined,
    srcAmount: undefined,
    srcPrice: undefined,
    srcValueUsd: undefined,

    dstChain: transfer.dst.event.ctx.chain,
    dstTime: transfer.dst.event.ctx.timestamp,
    dstEventId: transfer.dst.event.eventId,
    dstLogIndex: transfer.dst.event.ctx.logIndex,
    dstTxHash: transfer.dst.event.ctx.txHash,

    dstTokenAddress: transfer.dst.tokenAddress,
    dstRawAmount: transfer.dst.tokenAmount,
    dstWasMinted: transfer.dst.wasMinted,
    dstSymbol: undefined,
    dstAbstractTokenId: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,

    isProcessed: false,
  }
}
