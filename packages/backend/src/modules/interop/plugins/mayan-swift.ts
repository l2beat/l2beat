/*
Mayan SWIFT Protocol. If used independently, it emits only OrderCreated event with order hash and there is no
information about the Order itself. However, when used with MayanForwarder contract, we can capture
ForwardedETH or ForwardedERC20 event which contains order details and the destination chain info.

On the destination there's OrderFulfilled event with the order hash, plus a LogMessagePublished
for settlement back to the source chain. We extract the source chain from the settlement message payload.

Settlement Message Behavior:
- On Ethereum destinations: fulfillOrder is called with batch=false, so wormhole.publishMessage
  is called immediately and LogMessagePublished is emitted in the same tx as OrderFulfilled.
- On L2 destinations (Arbitrum, Base, etc.): fulfillOrder is called with batch=true for gas efficiency.
  The settlement message is stored and later sent via a separate postBatch(bytes32[] orderHashes) call
  that batches multiple settlements into a single wormhole message.

Because of this, we only capture the settlement LogMessagePublished in extraEvents when:
1. It exists in the same tx as OrderFulfilled (Ethereum destinations)
2. The order key in the payload matches the OrderFulfilled key (to avoid capturing unrelated messages)
*/

import { type Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { logToProtocolData, MayanForwarded } from './mayan-forwarder'
import {
  extractMayanSwiftSettlementDestChain,
  extractMayanSwiftSettlementOrderKey,
  getMayanSwiftSettlementMsgType,
  MAYAN_SWIFT,
  MAYAN_SWIFT_MSG_TYPE_UNLOCK,
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

const parseOrderCreated = createEventParser('event OrderCreated(bytes32 key)')

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)',
)

const parseLogMessagePublished = createEventParser(
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)',
)

export const OrderCreated = createInteropEventType<{
  key: string
  $dstChain: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  dstTokenAddress?: Address32
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createInteropEventType<{
  key: string
  dstAmount: bigint
  $srcChain?: string
}>('mayan-swift.OrderFulfilled')

// Settlement message sent via wormhole (non-batched case, same tx as OrderFulfilled)
export const SettlementSent = createInteropEventType<{
  key: string
  $dstChain?: string
}>('mayan-swift.SettlementSent')

export class MayanSwiftPlugin implements InteropPlugin {
  readonly name = 'mayan-swift'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      // Find LogMessagePublished in same tx from Mayan Swift to extract source chain
      // The settlement message goes back to the source chain
      // For non-batched (Ethereum destinations), also create SettlementSent event
      let $srcChain: string | undefined
      let settlementSent: ReturnType<typeof SettlementSent.create> | undefined
      for (const log of input.txLogs) {
        const logMsg = parseLogMessagePublished(log, null)
        if (logMsg && EthereumAddress(logMsg.sender) === MAYAN_SWIFT) {
          const msgType = getMayanSwiftSettlementMsgType(logMsg.payload)
          // Only handle single UNLOCK here, BATCH_UNLOCK is handled in mayan-swift-settlement plugin
          if (msgType !== MAYAN_SWIFT_MSG_TYPE_UNLOCK) break

          const orderKey = extractMayanSwiftSettlementOrderKey(logMsg.payload)
          // Verify the order key matches to avoid capturing wrong settlement
          if (orderKey !== orderFulfilled.key) break

          const srcChainId = extractMayanSwiftSettlementDestChain(
            logMsg.payload,
          )
          if (srcChainId !== undefined) {
            $srcChain = findChain(
              wormholeNetworks,
              (x) => x.wormholeChainId,
              srcChainId,
            )
          }

          // Create SettlementSent event for non-batched case
          // Use the log's position to create the event properly
          settlementSent = SettlementSent.create(
            { ...input, log },
            {
              key: orderKey,
              $dstChain: $srcChain, // Settlement destination is the original transfer's source
            },
          )
          break
        }
      }

      const events: ReturnType<
        typeof OrderFulfilled.create | typeof SettlementSent.create
      >[] = [
        OrderFulfilled.create(input, {
          key: orderFulfilled.key,
          dstAmount: orderFulfilled.netAmount,
          $srcChain,
        }),
      ]
      if (settlementSent) {
        events.push(settlementSent)
      }
      return events
    }

    const orderCreated = parseOrderCreated(input.log, null)
    if (orderCreated) {
      // see if we have Forwarded event in the same tx
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      const parsed = nextLog && logToProtocolData(nextLog, wormholeNetworks)
      const dstChain = parsed?.dstChain ?? 'unknown_missing_protocolData'
      return [
        OrderCreated.create(input, {
          key: orderCreated.key,
          $dstChain: dstChain,
          amountIn: parsed?.amountIn ?? input.tx.value, // for eth as srcToken there is no amountIn in protocoldata
          srcTokenAddress: parsed?.tokenIn,
          dstTokenAddress: parsed?.tokenOut,
        }),
      ]
    }
  }

  matchTypes = [OrderFulfilled]
  match(
    orderFulfilled: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) return
    const orderCreated = db.find(OrderCreated, {
      key: orderFulfilled.args.key,
    })
    if (!orderCreated) return
    const mayanForwarded = db.find(MayanForwarded, {
      sameTxAfter: orderCreated,
    })
    if (!mayanForwarded) return

    // Settlement messages (LogMessagePublished → OrderUnlocked) are matched separately
    // by the mayan-swift-settlement plugin

    return [
      // NOTE: This is a synthetic message. The real thing goes through wormhole and solana and we can't see it
      Result.Message('mayan-swift.Message', {
        app: 'mayan-swift',
        srcEvent: orderCreated,
        dstEvent: orderFulfilled,
      }),
      Result.Transfer('mayan-swift.Transfer', {
        srcEvent: orderCreated,
        srcAmount:
          orderCreated.args.amountIn !== 0n
            ? orderCreated.args.amountIn
            : mayanForwarded.args.amountIn !== 0n
              ? mayanForwarded.args.amountIn // MayanForwarded has WETH Withdrawal detection for ForwardedEth with tx.value=0
              : undefined, // 7702 + native ETH with no WETH Withdrawal - can't determine from events
        srcTokenAddress: orderCreated.args.srcTokenAddress,
        dstEvent: orderFulfilled,
        dstAmount: orderFulfilled.args.dstAmount,
        dstTokenAddress: orderCreated.args.dstTokenAddress,
        extraEvents: [mayanForwarded],
      }),
    ]
  }
}
