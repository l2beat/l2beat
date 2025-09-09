import type { Logger } from '@l2beat/backend-tools'
import type { BridgeMessageRecord, Database } from '@l2beat/database'
import type { BridgeStore } from './BridgeStore'
import {
  type BridgeMessage,
  type BridgePlugin,
  type BridgeTransfer,
  generateId,
  type MatchResult,
} from './plugins/types'

export class BridgeMatcher {
  private running = false

  constructor(
    private bridgeStore: BridgeStore,
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
    const matchedIds = new Set<string>()
    const messages: BridgeMessage[] = []
    const transfers: BridgeTransfer[] = []

    for (const event of this.bridgeStore.getUnmatched()) {
      if (matchedIds.has(event.eventId)) {
        continue
      }
      for (const plugin of this.plugins) {
        let result: MatchResult | undefined
        try {
          result = await plugin.match?.(event, this.bridgeStore)
        } catch (e) {
          this.logger.error(e)
        }

        if (result) {
          matchedIds.add(event.eventId)
          this.bridgeStore.markMatched(event)
          if (result.messages) {
            for (const message of result.messages) {
              messages.push(message)
              this.bridgeStore.markGrouped(message.inbound)
              this.bridgeStore.markGrouped(message.outbound)
            }
          }
          if (result.transfers) {
            for (const transfer of result.transfers) {
              transfers.push(transfer)
              for (const transferEvent of transfer.events) {
                this.bridgeStore.markGrouped(transferEvent)
              }
            }
          }
          this.logger.info('Matched', result)
        }
      }
    }

    if (matchedIds.size > 0) {
      this.logger.info('Matched', {
        count: matchedIds.size,
        messages: messages.length,
        transfers: transfers.length,
      })
      await this.bridgeStore.save()
    }
    if (messages.length > 0) {
      await this.db.bridgeMessage.insertMany(messages.map(toMessageRecord))
    }
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
