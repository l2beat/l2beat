/*
Mayan SWIFT Protocol. If used independently, it emits only OrderCreated event with order hash and there is no
information about the Order itself. However, when used with MayanForwarder contract, we can capture
ForwardedETH or ForwardedERC20 event which contains order details and the destination chain info.

However on the destination there's only OrderFulfilled event with the order hash. To get src chain
we would need to extract it from calldata (trace) - currently we don't do that.
*/

import { logToProtocolData, MayanForwarded } from './mayan-forwarder'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseOrderCreated = createEventParser('event OrderCreated(bytes32 key)')

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)',
)

export const OrderCreated = createInteropEventType<{
  key: string
  $dstChain: string
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createInteropEventType<{
  key: string
}>('mayan-swift.OrderFulfilled')

export class MayanSwiftPlugin implements InteropPlugin {
  name = 'mayan-swift'

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return [
        OrderFulfilled.create(input.ctx, {
          key: orderFulfilled.key.toString(),
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
      const parsed = nextLog && logToProtocolData(nextLog)
      const dstChain = parsed?.dstChain ?? 'unknown_missing_protocolData'
      return [
        OrderCreated.create(input.ctx, {
          key: orderCreated.key.toString(),
          $dstChain: dstChain,
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
      // TODO: tokens
      Result.Transfer('mayan-swift.Transfer', {
        srcEvent: orderCreated,
        dstEvent: orderFulfilled,
        extraEvents: [mayanForwarded],
      }),
    ]
  }
}
