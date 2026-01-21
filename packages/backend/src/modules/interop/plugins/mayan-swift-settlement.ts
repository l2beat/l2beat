/*
Mayan Swift Settlement Plugin

This plugin handles the settlement phase of Mayan Swift cross-chain transfers.
After a transfer is fulfilled on the destination chain, a settlement message is sent
back to the source chain via Wormhole to unlock the original collateral.

Settlement Flow:
1. SettlementSent: LogMessagePublished from MayanSwift containing unlock instructions
   - Non-batched (Ethereum destinations): Captured in mayan-swift.ts alongside OrderFulfilled
   - Batched (L2 destinations): Captured here from postBatch transactions
2. OrderUnlocked: Emitted on source chain when collateral is released

For batched settlements, a single LogMessagePublished contains multiple order keys.
We create one SettlementSent event per order key to enable 1-on-1 matching.
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { SettlementSent } from './mayan-swift'
import {
  extractMayanSwiftBatchOrderKeys,
  getMayanSwiftSettlementMsgType,
  MAYAN_SWIFT,
  MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK,
} from './mayan-swift.utils'
import {
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

const parseOrderUnlocked = createEventParser('event OrderUnlocked(bytes32 key)')

// OrderUnlocked event emitted on source chain when settlement is processed
export const OrderUnlocked = createInteropEventType<{
  key: string
  // TODO: $srcChain could be inferred from matching SettlementSent, but needs investigation
}>('mayan-swift.OrderUnlocked')

export class MayanSwiftSettlementPlugin implements InteropPlugin {
  readonly name = 'mayan-swift-settlement'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    // Capture OrderUnlocked events
    const orderUnlocked = parseOrderUnlocked(input.log, [MAYAN_SWIFT])
    if (orderUnlocked) {
      return [
        OrderUnlocked.create(input, {
          key: orderUnlocked.key,
        }),
      ]
    }

    // Capture batched SettlementSent from postBatch transactions
    // Non-batched settlements are captured in mayan-swift.ts
    const logMsg = parseLogMessagePublished(input.log, null)
    if (logMsg && EthereumAddress(logMsg.sender) === MAYAN_SWIFT) {
      const msgType = getMayanSwiftSettlementMsgType(logMsg.payload)
      if (msgType !== MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK) return

      const batchEntries = extractMayanSwiftBatchOrderKeys(logMsg.payload)
      if (!batchEntries || batchEntries.length === 0) return

      // Create one SettlementSent event per order key in the batch
      const events: ReturnType<typeof SettlementSent.create>[] = []
      for (const entry of batchEntries) {
        const $dstChain = findChain(
          wormholeNetworks,
          (x) => x.wormholeChainId,
          entry.dstChainId,
        )

        events.push(
          SettlementSent.create(input, {
            key: entry.key,
            $dstChain,
          }),
        )
      }

      return events
    }
  }

  matchTypes = [OrderUnlocked]
  match(
    orderUnlocked: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OrderUnlocked.checkType(orderUnlocked)) return

    // Find matching SettlementSent by order key
    // This works for both batched and non-batched settlements
    const settlementSent = db.find(SettlementSent, {
      key: orderUnlocked.args.key,
    })
    if (!settlementSent) return

    // Verify the settlement destination matches the chain where OrderUnlocked was captured
    // (the destination of the settlement is the source of the original transfer)
    if (
      settlementSent.args.$dstChain &&
      settlementSent.args.$dstChain !== orderUnlocked.ctx.chain
    ) {
      return // Chain mismatch, not a valid match
    }

    return [
      Result.Message('mayan-swift.SettlementMessage', {
        app: 'mayan-swift',
        srcEvent: settlementSent,
        dstEvent: orderUnlocked,
      }),
    ]
  }
}
