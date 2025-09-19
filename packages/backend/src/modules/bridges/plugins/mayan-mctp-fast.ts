import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import { CCTPv2MessageReceived, CCTPv2MessageSent } from './cctp'
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
import { WORMHOLE_NETWORKS } from './wormhole'

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(uint32 sourceDomain, bytes32 sourceNonce, uint256 amount)',
)

export const OrderFulfilled = createBridgeEventType<{
  amount: string
  sourceDomain: string
}>('mayan-mctp-fast.OrderFulfilled')

export class MayanMctpFastPlugin implements BridgePlugin {
  name = 'mayan-mctp-fast'

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, {
        amount: orderFulfilled.amount.toString(),
        sourceDomain:
          WORMHOLE_NETWORKS.find(
            (n) => n.wormholeChainId === Number(orderFulfilled.sourceDomain),
          )?.chain || '???',
      })
    }
  }

  match(
    orderFulfilled: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) return
    // find MessageReceived with the same txHash as OrderFulfilled
    const messageReceived = db.find(CCTPv2MessageReceived, {
      app: 'TokenMessengerV2',
      sameTxBefore: orderFulfilled,
    })
    if (!messageReceived || !messageReceived.args.hookData) return
    // find MessageSent with the same body as MessageReceived
    const messageSent = db.find(CCTPv2MessageSent, {
      app: 'TokenMessengerV2',
      hookData: messageReceived.args.hookData,
    })
    if (!messageSent || !messageSent.args.amount) return
    const orderPayload = decodeOrderPayload(messageReceived.args.hookData)
    if (!orderPayload) return
    return [
      Result.Message(
        messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
        [messageSent, messageReceived],
      ),
      Result.Transfer('cctp-v2.Transfer.mayan-mctp-fast', {
        srcEvent: messageSent,
        srcTokenAddress: messageSent.args.tokenAddress,
        srcAmount: messageSent.args.amount.toString(),
        dstEvent: messageReceived,
      }),
      Result.Transfer('mayan-mctp-fast.Swap', {
        srcEvent: messageSent,
        srcTokenAddress: messageSent.args.tokenAddress,
        srcAmount: messageSent.args.amount.toString(),
        dstEvent: orderFulfilled,
        dstTokenAddress: EthereumAddress(
          `0x${orderPayload.tokenOut.slice(-40)}`,
        ),
        dstAmount: orderFulfilled.args.amount.toString(),
      }),
    ]
  }
}

// TODO: link
function decodeOrderPayload(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const payloadType = reader.readUint8()
    const destAddr = reader.readBytes(32)
    const tokenOut = reader.readBytes(32)
    const amountOutMin = reader.readUint64()
    const gasDrop = reader.readUint64()
    const redeemFee = reader.readUint64()
    const refundFee = reader.readUint64()
    const deadline = reader.readUint64()
    const referrerAddr = reader.readBytes(32)
    const referrerBps = reader.readUint8()
    return {
      payloadType,
      destAddr,
      tokenOut,
      amountOutMin,
      gasDrop,
      redeemFee,
      refundFee,
      deadline,
      referrerAddr,
      referrerBps,
    }
  } catch {
    return undefined
  }
}
