import { Address32 } from '@l2beat/shared-pure'
import { BinaryReader } from '../../../tools/BinaryReader'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPv2MessageReceived, CCTPv2MessageSent } from './cctp/cctp-v2.plugin'
import { MayanForwarded } from './mayan-forwarder'
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

const parseOrderFulfilled = createEventParser(
  'event OrderFulfilled(uint32 sourceDomain, bytes32 sourceNonce, uint256 amount)',
)

export const OrderFulfilled = createInteropEventType<{
  amount: bigint
  $srcChain: string
}>('mayan-mctp-fast.OrderFulfilled')

export class MayanMctpFastPlugin implements InteropPlugin {
  readonly name = 'mayan-mctp-fast'

  constructor(private configs: InteropConfigStore) {}

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      const $srcChain = findChain(
        wormholeNetworks,
        (x) => x.wormholeChainId,
        Number(orderFulfilled.sourceDomain),
      )
      return [
        OrderFulfilled.create(input, {
          amount: orderFulfilled.amount,
          $srcChain,
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
    const mayanForwarded = db.find(MayanForwarded, {
      sameTxAfter: messageSent,
    })
    if (!mayanForwarded) return
    const orderPayload = decodeOrderPayload(messageReceived.args.hookData)
    if (!orderPayload) return
    return [
      Result.Message(
        messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
        {
          app: 'mayan-mctp-fast',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        },
      ),
      Result.Transfer('cctp-v2.Transfer', {
        // TODO: maybe this also has app: mayan-mctp-fast ?
        srcEvent: messageSent,
        srcTokenAddress: messageSent.args.tokenAddress,
        srcAmount: messageSent.args.amount,
        dstEvent: messageReceived,
      }),
      Result.Transfer('mayan-mctp-fast.Transfer', {
        srcEvent: messageSent,
        srcTokenAddress: messageSent.args.tokenAddress,
        srcAmount: messageSent.args.amount,
        dstEvent: orderFulfilled,
        dstTokenAddress: Address32.from(orderPayload.tokenOut),
        dstAmount: orderFulfilled.args.amount,
        extraEvents: [mayanForwarded],
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
