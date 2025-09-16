/*
Mayan SWIFT Protocol
*/

import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseOrderCreated = createEventParser('event OrderCreated(bytes32 key)')

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)',
)

export const OrderCreated = createBridgeEventType<{
  key: string
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createBridgeEventType<{
  key: string
}>('mayan-swift.OrderFullfilled')

export class MayanSwiftPlugin implements BridgePlugin {
  name = 'mayan-swift'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, {
        key: orderFulfilled.key.toString(),
      })
    }

    const orderCreated = parseOrderCreated(input.log, null)
    if (orderCreated) {
      return OrderCreated.create(input.ctx, {
        key: orderCreated.key.toString(),
      })
    }
  }

  match(
    orderFulfilled: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) return
    const orderCreated = db.find(OrderCreated, {
      key: orderFulfilled.args.key,
    })
    if (!orderCreated) return
    return [
      // TODO: implement properly. Handle optional wormhole core settlement event
      Result.Transfer('mayan-swift.Swap', {
        srcEvent: orderCreated,
        dstEvent: orderFulfilled,
      }),
    ]
  }
}
