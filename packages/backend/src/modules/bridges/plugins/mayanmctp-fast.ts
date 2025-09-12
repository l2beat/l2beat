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
} from './types'
import { NETWORKS } from './wormhole'

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(uint32 sourceDomain, bytes32 sourceNonce, uint256 amount)',
)

export const OrderFulfilled = createBridgeEventType<{
  txHash: string
  amount: string
  sourceDomain: string
}>('mayanmctp-fast.OrderFullfilled')

export class MayanMctpFastPlugin implements BridgePlugin {
  name = 'mayanmctp-fast'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      return OrderFulfilled.create(input.ctx, {
        txHash: input.ctx.txHash,
        amount: orderFulfilled.amount.toString(),
        sourceDomain:
          NETWORKS.find(
            (n) => n.wormholeChainId === Number(orderFulfilled.sourceDomain),
          )?.chain || '???',
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
    // find MessageReceived with the same txHash as OrderFulfilled
    const messageReceived = db.find(CCTPv2MessageReceived, {
      app: 'TokenMessengerV2',
      txHash: orderFulfilled.args.txHash,
    })
    if (!messageReceived || !messageReceived.args.hookData) {
      return
    }
    // find MessageSent with the same body as MessageReceived
    const messageSent = db.find(CCTPv2MessageSent, {
      app: 'TokenMessengerV2',
      hookData: messageReceived.args.hookData,
    })
    if (!messageSent || !messageSent.args.amount) {
      return
    }

    const orderPayload = decodeOrderPayload(messageReceived.args.hookData)
    if (!orderPayload) {
      return
    }
    const transfer = {
      amountIn: messageSent.args.amount,
      tokenIn: 'USDC',
      amountOut: orderFulfilled.args.amount,
      tokenOut: orderPayload.tokenOut,
    }
    // TODO: use this to save the transfer
    void transfer

    return {
      messages: [
        {
          type: messageSent.args.fast
            ? 'cctp-v2.FastMessage'
            : 'cctp-v2.SlowMessage',
          outbound: messageSent,
          inbound: messageReceived,
        },
        {
          type: 'cctp-v2.BRIDGE',
          outbound: messageSent,
          inbound: messageReceived,
        },
        {
          type: 'mayanmctp-fast.SWAP',
          outbound: messageSent,
          inbound: orderFulfilled,
        },
      ],
    }
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
