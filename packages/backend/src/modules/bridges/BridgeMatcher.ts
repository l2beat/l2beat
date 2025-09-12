import type { Logger } from '@l2beat/backend-tools'
import type {
  BridgeMessageRecord,
  BridgeTransferRecord,
  Database,
} from '@l2beat/database'
import type { BridgeStore } from './BridgeStore'
import type { FinancialsService } from './financials/FinancialsService'
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
    private financialsService: FinancialsService,
    private db: Database,
    private plugins: BridgePlugin[],
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
      this.logger,
    )

    if (result.matchedIds.size > 0) {
      this.logger.info('Matched', {
        count: result.matchedIds.size,
        messages: result.messages.length,
        transfers: result.transfers.length,
      })
      this.bridgeStore.markMatched([...result.matchedIds])
      await this.bridgeStore.save()
    }
    if (result.messages.length > 0) {
      await this.db.bridgeMessage.insertMany(
        result.messages.map(toMessageRecord),
      )
    }

    if (result.transfers.length > 0) {
      const transfers: BridgeTransferWithFinancials[] = await Promise.all(
        result.transfers.map(
          async (b) => await this.financialsService.addFinancials(b),
        ),
      )

      await this.db.bridgeTransfer.insertMany(transfers.map(toTransferRecord))
    }
  }
}

export async function match(
  db: BridgeEventDb,
  events: BridgeEvent[],
  plugins: BridgePlugin[],
  logger: Logger,
) {
  const matchedIds = new Set<string>()
  const messages: BridgeMessage[] = []
  const transfers: BridgeTransfer[] = []

  for (const plugin of plugins) {
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

      if (result) {
        matchedIds.add(event.eventId)
        for (const message of result.messages ?? []) {
          messages.push(message)
          matchedIds.add(message.inbound.eventId)
          matchedIds.add(message.outbound.eventId)
        }
        for (const transfer of result.transfers ?? []) {
          transfers.push(transfer)
          for (const transferEvent of transfer.events) {
            matchedIds.add(transferEvent.eventId)
          }
        }
      }
    }
  }

  return {
    matchedIds,
    messages,
    transfers,
  }
}

function toMessageRecord(message: BridgeMessage): BridgeMessageRecord {
  return {
    messageId: generateId('M'),
    type: message.type,
    duration: Math.abs(
      message.inbound.ctx.timestamp - message.outbound.ctx.timestamp,
    ),
    timestamp: Math.max(
      message.outbound.ctx.timestamp,
      message.inbound.ctx.timestamp,
    ),

    srcChain: message.outbound.ctx.chain,
    srcTime: message.outbound.ctx.timestamp,
    srcEventId: message.outbound.eventId,
    srcLogIndex: message.outbound.ctx.logIndex,
    srcTxHash: message.outbound.ctx.txHash,

    dstChain: message.inbound.ctx.chain,
    dstTime: message.inbound.ctx.timestamp,
    dstEventId: message.inbound.eventId,
    dstLogIndex: message.inbound.ctx.logIndex,
    dstTxHash: message.inbound.ctx.txHash,
  }
}

function toTransferRecord(
  transfer: BridgeTransferWithFinancials,
): BridgeTransferRecord {
  return {
    messageId: generateId('T'),
    type: transfer.type,
    duration: Math.abs(
      transfer.inbound.event.ctx.timestamp -
        transfer.outbound.event.ctx.timestamp,
    ),
    timestamp: Math.max(
      transfer.outbound.event.ctx.timestamp,
      transfer.inbound.event.ctx.timestamp,
    ),

    srcChain: transfer.outbound.event.ctx.chain,
    srcTime: transfer.outbound.event.ctx.timestamp,
    srcEventId: transfer.outbound.event.eventId,
    srcLogIndex: transfer.outbound.event.ctx.logIndex,
    srcTxHash: transfer.outbound.event.ctx.txHash,

    srcTokenAddress: transfer.outbound.token?.address,
    srcRawAmount: transfer.outbound.token?.amount,
    srcSymbol: transfer.outbound.financials?.symbol,
    srcAmount: transfer.outbound.financials?.amount,
    srcPrice: transfer.outbound.financials?.price,
    srcValueUsd: transfer.outbound.financials?.valueUsd,

    dstChain: transfer.inbound.event.ctx.chain,
    dstTime: transfer.inbound.event.ctx.timestamp,
    dstEventId: transfer.inbound.event.eventId,
    dstLogIndex: transfer.inbound.event.ctx.logIndex,
    dstTxHash: transfer.inbound.event.ctx.txHash,

    dstTokenAddress: transfer.inbound.token?.address,
    dstRawAmount: transfer.inbound.token?.amount,
    dstSymbol: transfer.inbound.financials?.symbol,
    dstAmount: transfer.inbound.financials?.amount,
    dstPrice: transfer.inbound.financials?.price,
    dstValueUsd: transfer.inbound.financials?.valueUsd,
  }
}
