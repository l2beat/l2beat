import type { Logger } from '@l2beat/backend-tools'
import type { BridgeMessageRecord, Database } from '@l2beat/database'
import { BigIntWithDecimals } from '../tvs/tools/bigIntWithDecimals'
import type { BridgeStore } from './BridgeStore'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgeMessage,
  type BridgePlugin,
  type BridgeTransfer,
  generateId,
  type MatchResult,
  type TransferSideWithFinancials,
} from './plugins/types'
import { BRIDGES_TOKENS } from './tokens/config'

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
  const bridgeTransfers: BridgeTransfer[] = []

  for (const event of events) {
    if (matchedIds.has(event.eventId)) {
      continue
    }
    for (const plugin of plugins) {
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
          bridgeTransfers.push(transfer)
          for (const transferEvent of transfer.events) {
            matchedIds.add(transferEvent.eventId)
          }
        }
        break
      }
    }
  }

  const tokens = new Map(
    BRIDGES_TOKENS.flatMap((t) =>
      t.addresses.map((tt) => ({
        key: `${tt.chain}:${tt.address}`,
        value: {
          coingeckoId: t.coingeckoId,
          symbol: t.symbol,
          decimals: t.decimals,
        },
      })),
    ).map(({ key, value }) => [key, value]),
  )

  const transfers: (BridgeTransfer & {
    outbound: TransferSideWithFinancials
    inbound: TransferSideWithFinancials
  })[] = []

  for (const transfer of bridgeTransfers) {
    let outbound: TransferSideWithFinancials = transfer.outbound
    let inbound: TransferSideWithFinancials = transfer.inbound

    if (transfer.outbound.token) {
      const token = tokens.get(
        `${transfer.outbound.tx.chain}:${transfer.outbound.token.address}`,
      )
      if (token) {
        const amount = BigIntWithDecimals(
          BigInt(transfer.outbound.token.amount),
          token.decimals,
        )

        const price = 1

        const value = BigIntWithDecimals.multiply(
          amount,
          BigIntWithDecimals.fromNumber(price),
        )

        outbound = {
          ...outbound,
          financials: {
            amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
            valueUsd: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
            symbol: token.symbol,
          },
        }
      }

      if (transfer.inbound.token) {
        const token = tokens.get(
          `${transfer.inbound.tx.chain}:${transfer.inbound.token.address}`,
        )
        if (token) {
          const amount = BigIntWithDecimals(
            BigInt(transfer.inbound.token.amount),
            token.decimals,
          )

          const price = 1

          const value = BigIntWithDecimals.multiply(
            amount,
            BigIntWithDecimals.fromNumber(price),
          )

          inbound = {
            ...inbound,
            financials: {
              amount: Number(BigIntWithDecimals.toNumber(amount).toFixed(2)),
              valueUsd: Number(BigIntWithDecimals.toNumber(value).toFixed(2)),
              symbol: token.symbol,
            },
          }
        }
      }
    }

    transfers.push({
      type: transfer.type,
      events: transfer.events,
      outbound,
      inbound,
    })
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
