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

import { ChainSpecificAddress, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { SettlementSent } from './mayan-swift'
import {
  extractMayanSwiftBatchOrderKeys,
  extractWormholeEmitterChainFromTxData,
  getMayanSwiftSettlementMsgType,
  MAYAN_SWIFT,
  MAYAN_SWIFT_CHAINS,
  MAYAN_SWIFT_MSG_TYPE_BATCH_UNLOCK,
} from './mayan-swift.utils'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

// Event signatures
const logMessagePublishedLog =
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)'
const orderUnlockedLog = 'event OrderUnlocked(bytes32 key)'

const parseLogMessagePublished = createEventParser(logMessagePublishedLog)

const parseOrderUnlocked = createEventParser(orderUnlockedLog)

// OrderUnlocked event emitted on source chain when settlement is processed
// $srcChain is the chain where SettlementSent was emitted (the transfer destination chain)
// It's extracted from the Wormhole VAA in the transaction input and used to mark events
// as unsupported when the settlement source chain is not in our supported chains list
export const OrderUnlocked = createInteropEventType<{
  key: string
  $srcChain?: string
}>('mayan-swift.OrderUnlocked')

export class MayanSwiftSettlementPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-swift-settlement'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const mayanSwiftAddresses: ChainSpecificAddress[] = []
    for (const chain of MAYAN_SWIFT_CHAINS) {
      try {
        mayanSwiftAddresses.push(
          ChainSpecificAddress.fromLong(chain, MAYAN_SWIFT),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: orderUnlockedLog,
        includeTx: true, // Need tx.data to extract emitter chain from VAA
        addresses: mayanSwiftAddresses,
      },
      {
        type: 'event',
        signature: logMessagePublishedLog,
        addresses: mayanSwiftAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    // Capture OrderUnlocked events
    const orderUnlocked = parseOrderUnlocked(input.log, [MAYAN_SWIFT])
    if (orderUnlocked) {
      // Extract emitter chain from the Wormhole VAA in transaction input
      // This tells us which chain the settlement message came from
      const txData =
        typeof input.tx.data === 'string' ? input.tx.data : undefined
      const emitterChainId = extractWormholeEmitterChainFromTxData(txData)
      const $srcChain = emitterChainId
        ? findChain(wormholeNetworks, (x) => x.wormholeChainId, emitterChainId)
        : undefined

      return [
        OrderUnlocked.create(input, {
          key: orderUnlocked.key,
          $srcChain,
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
