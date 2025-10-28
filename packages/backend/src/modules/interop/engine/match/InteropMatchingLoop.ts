import type { Logger } from '@l2beat/backend-tools'
import type {
  Database,
  InteropMessageRecord,
  InteropTransferRecord,
} from '@l2beat/database'
import { TimeLoop } from '../../../../tools/TimeLoop'
import {
  generateId,
  type InteropEvent,
  type InteropEventDb,
  type InteropMessage,
  type InteropPlugin,
  type InteropTransfer,
  type MatchResult,
} from '../../plugins/types'
import type { InteropEventStore } from '../capture/InteropEventStore'

export class InteropMatchingLoop extends TimeLoop {
  constructor(
    private store: InteropEventStore,
    private db: Database,
    private plugins: InteropPlugin[],
    private supportedChains: string[],
    protected logger: Logger,
    intervalMs = 10_000,
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

    await this.db.transaction(async () => {
      if (result.matchedIds.size > 0 || result.unsupportedIds.size > 0) {
        await this.store.updateMatchedAndUnsupported({
          matched: result.matchedIds,
          unsupported: result.unsupportedIds,
        })
      }
      const messages = await this.db.interopMessage.insertMany(
        result.messages.map(toMessageRecord),
      )
      const transfers = await this.db.interopTransfer.insertMany(
        result.transfers.map(toTransferRecord),
      )

      this.logger.info('Matching results saved', {
        messages,
        transfers,
      })
    })
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

  const matchedIds = new Set<string>()
  const unsupportedIds = new Set<string>()
  const allMessages: InteropMessage[] = []
  const allTransfers: InteropTransfer[] = []

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
        if (matchedIds.has(event.eventId)) {
          continue
        }
        let result: MatchResult | undefined
        try {
          result = await plugin.match?.(event, db)
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

        matchedIds.add(event.eventId)
        for (const item of result) {
          if (item.kind === 'InteropMessage') {
            allMessages.push({ ...item, plugin: plugin.name })
            stats.messages++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matchedIds.add(event.eventId)
            }
          } else if (item.kind === 'InteropTransfer') {
            allTransfers.push({ ...item, plugin: plugin.name })
            stats.transfers++
            stats.matchedEvents += item.events.length
            for (const event of item.events) {
              matchedIds.add(event.eventId)
            }
          } else if (item.kind === 'InteropIgnore') {
            for (const event of item.events) {
              unsupportedIds.add(event.eventId)
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
      if (matchedIds.has(event.eventId)) {
        continue
      }
      const $srcChain = (event.args as Record<string, unknown>).$srcChain
      if (
        typeof $srcChain === 'string' &&
        !supportedChains.includes($srcChain)
      ) {
        unsupportedIds.add(event.eventId)
      }
      const $dstChain = (event.args as Record<string, unknown>).$dstChain
      if (
        typeof $dstChain === 'string' &&
        !supportedChains.includes($dstChain)
      ) {
        unsupportedIds.add(event.eventId)
      }
    }
  }

  logger.info('Matching finished', {
    duration: Date.now() - start,
    plugins: plugins.length,
    events: count,
    chains: supportedChains.length,
    matchedEvents: matchedIds.size,
    unsupportedEvents: unsupportedIds.size,
    messages: allMessages.length,
    transfers: allTransfers.length,
  })

  return {
    matchedIds,
    unsupportedIds,
    messages: allMessages,
    transfers: allTransfers,
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
    messageId: generateId('T'),
    type: transfer.type,
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
    dstSymbol: undefined,
    dstAbstractTokenId: undefined,
    dstAmount: undefined,
    dstPrice: undefined,
    dstValueUsd: undefined,

    isProcessed: false,
  }
}
