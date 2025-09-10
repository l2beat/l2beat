/* 
Mayan MCTP Protocol
- bridge with fee on source: bridges USDC using CCTP v1, fee stays on source, Wormhole msg from dst-->src is generated
- bridge with fee on destination: bridges USDC using CCTP v1, fee is transferred to dst, on dst FeeDeposited event is generated, Wormhole msg from dst-->src is generated
- swap: wormhole msg from Solana on dst is present, OrderFulfilled on dst is present, Wormhole msg on src to Solana is present with Order info
*/

import { CCTPv1MessageReceived, CCTPv1MessageSent } from './CCTPPlugin'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'
import { LogMessagePublished } from './wormhole'
export class MayanMctpPlugin implements BridgePlugin {
  name = 'MayanMctp'
  chains = ['ethereum', 'arbitrum', 'base']

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!CCTPv1MessageReceived.checkType(event)) {
      return
    }

    const messageSent = db.find(CCTPv1MessageSent, {
      messageBody: event.args.messageBody,
    })
    if (!messageSent) {
      return
    }

    const logMessagePublished = db.find(LogMessagePublished, {
      txHash: messageSent.args.txHash,
    })
    if (!logMessagePublished) {
      return
    }

    return {
      messages: [
        {
          type: 'CCTPv1.Message',
          inbound: event,
          outbound: messageSent,
        },
        {
          type: 'mayan.WormholeMessage',
          inbound: event,
          outbound: logMessagePublished,
        },
      ],
    }
  }
}
