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
} from './types'

const parseOrderCreated = createEventParser('event OrderCreated(bytes32 key)')

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)',
)

export const OrderCreated = createBridgeEventType<{
  txHash: string
  key: string
}>('mayanswift.OrderCreated')

export const OrderFulfilled = createBridgeEventType<{
  txHash: string
  key: string
}>('mayanswift.OrderFullfilled')

export class MayanSwiftPlugin implements BridgePlugin {
  name = 'mayanswift'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, {
        txHash: input.ctx.txHash,
        key: orderFulfilled.key.toString(),
      })
    }

    const orderCreated = parseOrderCreated(input.log, null)
    if (orderCreated) {
      return OrderCreated.create(input.ctx, {
        txHash: input.ctx.txHash,
        key: orderCreated.key.toString(),
      })
    }
  }

  match(
    orderFulfilled: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) {
      return
    }

    const orderCreated = db.find(OrderCreated, {
      key: orderFulfilled.args.key,
    })
    if (!orderCreated) {
      return
    }

    return {
      messages: [
        {
          // TODO: Remove once transfers work
          type: 'mayanswift.Swap',
          outbound: orderCreated,
          inbound: orderFulfilled,
        },
      ],
      transfers: [
        {
          // TODO: Implement transfer properly
          type: 'mayanswift.Swap',
          events: [orderCreated, orderFulfilled],
          outbound: { event: orderCreated },
          inbound: { event: orderFulfilled },
        },
      ],
    }
  }
}
