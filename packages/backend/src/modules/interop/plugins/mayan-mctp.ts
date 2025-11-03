/*
Mayan MCTP Protocol
- bridge with locked fee on source: bridges USDC using CCTP v1, fee stays on source, Wormhole msg from dst-->src is generated (0x32ad465f, 0x9be95bb4)
- bridge with fee on destination: bridges USDC using CCTP v1, fee is transferred to dst, on dst FeeDeposited event is generated, Wormhole msg from src-->dst is generated (0x9445a5d, 0x2072197f)
- swap: wormhole msg from Solana on dst is present, OrderFulfilled on dst is present, Wormhole msg on src to Solana is present with Order info (0xafd9b706, 0x1c59b7fc)
*/

import { CCTPv1MessageReceived, CCTPv1MessageSent } from './cctp/cctp-v1.plugin'
import { MayanForwarded } from './mayan-forwarder'
import {
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type MatchResult,
  Result,
} from './types'
import { LogMessagePublished } from './wormhole'

export class MayanMctpPlugin implements InteropPlugin {
  name = 'mayan-mctp'

  matchTypes = [MayanForwarded]
  //TODO: This plugin starts from the SRC (ForwardedERC20) but CCTP plugin starts from DST and clears events. This needs to be solved somehow...
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (!MayanForwarded.checkType(event)) {
      return
    }
    // find CCTP MessageSent in the same transaction as Mayan Forwarder event
    const messageSent = db.find(CCTPv1MessageSent, {
      sameTxBefore: event,
    })
    if (!messageSent) return
    // find CCTP MessageReceived
    const messageReceived = db.find(CCTPv1MessageReceived, {
      messageBody: messageSent.args.messageBody,
    })
    if (!messageReceived) return
    // find Wormhole LogMessagePublished from Src --> Dst if bridgedWithFee() or createdOrder() is used
    if (
      // TODO: say what those are :)
      event.args.methodSignature === '0x9445a5d' ||
      event.args.methodSignature === '0xafd9b706' ||
      event.args.methodSignature === '0x2072197f' ||
      event.args.methodSignature === '0x1c59b7fc'
    ) {
      const logMessagePublished = db.find(LogMessagePublished, {
        sameTxAfter: messageSent,
      })
      if (!logMessagePublished) return
      return [
        Result.Message('cctp-v1.Message', {
          app: 'mayan-mctp',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        }),
        Result.Message('wormhole.Message', {
          app: 'mayan-mctp',
          srcEvent: logMessagePublished,
          dstEvent: messageReceived,
        }),
        // TODO: transfer, use event
      ]
    }
    return [
      Result.Message('cctp-v1.Message', {
        app: 'mayan-mctp',
        srcEvent: messageSent,
        dstEvent: messageReceived,
      }),
      // TODO: transfer, use event
    ]
  }
}
