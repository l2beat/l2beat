/*
Mayan SWIFT Protocol. If used independently, it emits only OrderCreated event with order hash and there is no
information about the Order itself. However, when used with MayanForwarder contract, we can capture
ForwardedETH or ForwardedERC20 event which contains order details and the destination chain info.

On the destination there's OrderFulfilled event with the order hash, plus a LogMessagePublished
for settlement back to the source chain. We extract the source chain from the settlement message payload.
*/

import { type Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { logToProtocolData, MayanForwarded } from './mayan-forwarder'
import {
  extractMayanSwiftSettlementDestChain,
  MAYAN_SWIFT,
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
      let $srcChain: string | undefined
      for (const log of input.txLogs) {
        const logMsg = parseLogMessagePublished(log, null)
        if (logMsg && EthereumAddress(logMsg.sender) === MAYAN_SWIFT) {
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
          break
        }
      }
      return [
        OrderFulfilled.create(input, {
          key: orderFulfilled.key,
          dstAmount: orderFulfilled.netAmount,
          $srcChain,
        }),
      ]
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
    return [
      // NOTE: This is a synthetic message. The real thing goes through wormhole and solana and we can't see it
      Result.Message('mayan-swift.Message', {
        app: 'mayan-swift',
        srcEvent: orderCreated,
        dstEvent: orderFulfilled,
      }),
      // TODO: implement properly. Handle optional wormhole core settlement event
      Result.Transfer('mayan-swift.Transfer', {
        srcEvent: orderCreated,
        srcAmount:
          orderCreated.args.amountIn !== 0n
            ? orderCreated.args.amountIn
            : orderFulfilled.args.dstAmount, // dirty fallback for special cases like 7702 + eth at source with 0 tx.value (see examples)
        srcTokenAddress: orderCreated.args.srcTokenAddress,
        dstEvent: orderFulfilled,
        dstAmount: orderFulfilled.args.dstAmount,
        dstTokenAddress: orderCreated.args.dstTokenAddress,
        extraEvents: [mayanForwarded],
      }),
    ]
  }
}
