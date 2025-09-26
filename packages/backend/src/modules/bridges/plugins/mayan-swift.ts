/*
Mayan SWIFT Protocol. If used independently, it emits only OrderCreated event with order hash and there is no 
information about the Order itself. However, when used with MayanForwarder contract, we can capture
ForwardedETH or ForwardedERC20 event which contains order details and the destination chain info.

However on the destination there's only OrderFulfilled event with the order hash. To get src chain
we would need to extract it from calldata (trace) - currently we don't do that.
*/

import { decodeFunctionData, parseAbiItem } from 'viem'
import { parseForwardedEth } from './mayan-forwarder'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  findChain,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { WORMHOLE_NETWORKS } from './wormhole'

const parseOrderCreated = createEventParser('event OrderCreated(bytes32 key)')

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)',
)

export const OrderCreated = createBridgeEventType<{
  key: string
  protocolData: `0x${string}` | null
  $dstChain: string
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createBridgeEventType<{
  key: string
}>('mayan-swift.OrderFulfilled')

export class MayanSwiftPlugin implements BridgePlugin {
  name = 'mayan-swift'

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, {
        key: orderFulfilled.key.toString(),
      })
    }

    const abi =
      'function createOrderWithEth((bytes32 trader,bytes32 tokenOut,uint64 minAmountOut,uint64 gasDrop,uint64 cancelFee,uint64 refundFee,uint64 deadline, bytes32 destAddr,uint16 dstChainId,bytes32 referrerAddress,uint8 referrerBps,uint8 auctionMode,bytes32 random))'

    const orderCreated = parseOrderCreated(input.log, null)
    if (orderCreated) {
      let dstChain = 'no protocolData, nothing to extract'
      let protocolData = null
      // see if we have Forwarded event in the same tx
      const nextLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! + 1,
      )
      if (nextLog) {
        const forwardedEth = parseForwardedEth(nextLog, null)
        if (forwardedEth) {
          protocolData = forwardedEth.protocolData
          const abiItem = parseAbiItem(abi)
          const { functionName, args } = decodeFunctionData({
            abi: [abiItem],
            data: protocolData,
          })

          // console.log(args)

          if (functionName === 'createOrderWithEth') {
            dstChain = findChain(
              WORMHOLE_NETWORKS,
              (x) => x.wormholeChainId,
              args[0].dstChainId,
            )
          }
        }
      }
      return OrderCreated.create(input.ctx, {
        key: orderCreated.key.toString(),
        protocolData: protocolData,
        $dstChain: dstChain,
      })
    }
  }

  matchTypes = [OrderFulfilled]
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
