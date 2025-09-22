import type { Logger } from '@l2beat/backend-tools'
import type {
  BridgeMessageRecord,
  BridgeTransferRecord,
  Database,
} from '@l2beat/database'
import type { BridgeStore } from './BridgeStore'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgeMessage,
  type BridgePlugin,
  type BridgeTransfer,
  type BridgeTransferWithFinancials,
  generateId,
  type MatchResult,
} from './plugins/types'

export class BridgeMatcher {
  private running = false

  constructor(
    private bridgeStore: BridgeStore,
    private db: Database,
    private plugins: BridgePlugin[],
    private supportedChains: string[],
    private logger: Logger,
    private intervalMs = 10_000,
  ) {
    this.logger = logger.for(this)
  }

  start() {
    const runMatching = async () => {
      if (this.running) {
        return
      }
      this.running = true
      try {
        await this.doMatching()
      } catch (e) {
        this.logger.error(e)
      }
      this.running = false
    }
    setInterval(runMatching, this.intervalMs)
    runMatching()
    this.logger.info('Started')
  }

  async doMatching() {
    const result = await match(
      this.bridgeStore,
      this.bridgeStore.getUnmatched(),
      this.plugins,
      this.supportedChains,
      this.logger,
    )

    await this.db.transaction(async () => {
      if (result.matchedIds.size > 0 || result.unsupportedIds.size > 0) {
        await this.bridgeStore.updateMatchedAndUnsupported({
          matched: result.matchedIds,
          unsupported: result.unsupportedIds,
        })
      }
      await this.db.bridgeMessage.insertMany(
        result.messages.map(toMessageRecord),
      )
      await this.db.bridgeTransfer.insertMany(
        result.transfers.map(toTransferRecord),
      )
    })
  }
}

export async function match(
  db: BridgeEventDb,
  events: BridgeEvent[],
  plugins: BridgePlugin[],
  supportedChains: string[],
  logger: Logger,
) {
  const start = Date.now()
  logger.info('Matching started', {
    plugins: plugins.length,
    events: events.length,
    chains: supportedChains.length,
  })

  const matchedIds = new Set<string>()
  const unsupportedIds = new Set<string>()
  const allMessages: BridgeMessage[] = []
  const allTransfers: BridgeTransfer[] = []

  for (const plugin of plugins) {
    await new Promise((r) => setTimeout(r)) // Unblock event loop
    const start = Date.now()
    for (const event of events) {
      if (matchedIds.has(event.eventId)) {
        continue
      }
      let result: MatchResult | undefined
      try {
        result = await plugin.match?.(event, db)
      } catch (e) {
        logger.error(e)
      }
      if (!result) {
        continue
      }

      matchedIds.add(event.eventId)
      for (const item of result) {
        if (item.kind === 'BridgeMessage') {
          allMessages.push(item)
          matchedIds.add(item.dst.eventId)
          matchedIds.add(item.src.eventId)
        } else if (item.kind === 'BridgeTransfer') {
          allTransfers.push(item)
          for (const transferEvent of item.events) {
            matchedIds.add(transferEvent.eventId)
          }
        }
      }
    }
    logger.debug('Plugin executed', {
      name: plugin.name,
      duration: Date.now() - start,
    })
  }

  for (const event of events) {
    if (matchedIds.has(event.eventId)) {
      continue
    }
    const $srcChain = (event.args as Record<string, unknown>).$srcChain
    if (typeof $srcChain === 'string' && !supportedChains.includes($srcChain)) {
      unsupportedIds.add(event.eventId)
    }
    const $dstChain = (event.args as Record<string, unknown>).$dstChain
    if (typeof $dstChain === 'string' && !supportedChains.includes($dstChain)) {
      unsupportedIds.add(event.eventId)
    }
  }

  logger.info('Matching finished', {
    duration: Date.now() - start,
    plugins: plugins.length,
    events: events.length,
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

function toMessageRecord(message: BridgeMessage): BridgeMessageRecord {
  return {
    messageId: generateId('M'),
    type: message.type,
    duration: Math.abs(message.dst.ctx.timestamp - message.src.ctx.timestamp),
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

function toTransferRecord(
  transfer: BridgeTransferWithFinancials,
): BridgeTransferRecord {
  return {
    messageId: generateId('T'),
    type: transfer.type,
    duration: Math.abs(
      transfer.dst.event.ctx.timestamp - transfer.src.event.ctx.timestamp,
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
    srcSymbol: transfer.src.financials?.symbol,
    srcAmount: transfer.src.financials?.amount,
    srcPrice: transfer.src.financials?.price,
    srcValueUsd: transfer.src.financials?.valueUsd,

    dstChain: transfer.dst.event.ctx.chain,
    dstTime: transfer.dst.event.ctx.timestamp,
    dstEventId: transfer.dst.event.eventId,
    dstLogIndex: transfer.dst.event.ctx.logIndex,
    dstTxHash: transfer.dst.event.ctx.txHash,

    dstTokenAddress: transfer.dst.tokenAddress,
    dstRawAmount: transfer.dst.tokenAmount,
    dstSymbol: transfer.dst.financials?.symbol,
    dstAmount: transfer.dst.financials?.amount,
    dstPrice: transfer.dst.financials?.price,
    dstValueUsd: transfer.dst.financials?.valueUsd,
  }
}
