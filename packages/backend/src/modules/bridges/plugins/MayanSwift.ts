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
}>('MayanMctpSwift.OrderCreated')

export const OrderFulfilled = createBridgeEventType<{
  txHash: string
  key: string
}>('MayanMctpSwift.OrderFullfilled')

export class MayanSwift implements BridgePlugin {
  name = 'MayanSwift'
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
          type: 'MayanSwift.SWAP',
          outbound: orderCreated,
          inbound: orderFulfilled,
        },
      ],
    }
  }
}
