/* 
Mayan MCTP Protocol
- bridge with locked fee on source: bridges USDC using CCTP v1, fee stays on source, Wormhole msg from dst-->src is generated (0x32ad465f, 0x9be95bb4)
- bridge with fee on destination: bridges USDC using CCTP v1, fee is transferred to dst, on dst FeeDeposited event is generated, Wormhole msg from src-->dst is generated (0x9445a5d, 0x2072197f)
- swap: wormhole msg from Solana on dst is present, OrderFulfilled on dst is present, Wormhole msg on src to Solana is present with Order info (0xafd9b706, 0x1c59b7fc)
*/

import { CCTPv1MessageReceived, CCTPv1MessageSent } from './cctp'
import {
  ForwadedERC20,
  ForwadedEth,
  SwapAndForwardedERC20,
  SwapAndForwardedEth,
} from './mayanforwarder'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'
import { LogMessagePublished } from './wormhole'

export class MayanMctpPlugin implements BridgePlugin {
  name = 'mayanmctp'
  chains = ['ethereum', 'arbitrum', 'base']

  //TODO: This plugin starts from the SRC (ForwardedERC20) but CCTP plugin starts from DST and clears events. This needs to be solved somehow...
  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    //console.log('mayanmctp.match called')
    if (
      !ForwadedERC20.checkType(event) &&
      !ForwadedEth.checkType(event) &&
      !SwapAndForwardedERC20.checkType(event) &&
      !SwapAndForwardedEth.checkType(event)
    ) {
      return
    }
    // find CCTP MessageSent in the same transaction as Mayan Forwarder event
    const messageSent = db.find(CCTPv1MessageSent, {
      txHash: event.args.txHash,
    })
    if (!messageSent) {
      console.log('mayanmctp.match: no CCTP MessageSent found')
      return
    }
    // find CCTP MessageReceived
    const messageReceived = db.find(CCTPv1MessageReceived, {
      messageBody: messageSent.args.messageBody,
    })
    if (!messageReceived) {
      console.log('mayanmctp.match: no CCTP MessageReceived found')
      return
    }
    //console.log('mayanmctp.match: found CCTP Message Received')
    // find Wormhole LogMessagePublished from Src --> Dst if bridgedWithFee() or createdOrder() is used
    const method = event.args.protocolData.slice(0, 10)
    //console.log('mayanmctp.match: method', method)
    if (
      method === '0x9445a5d' ||
      method === '0xafd9b706' ||
      method === '0x2072197f' ||
      method === '0x1c59b7fc'
    ) {
      const logMessagePublished = db.find(LogMessagePublished, {
        txHash: messageSent.ctx.txHash,
      })
      if (!logMessagePublished) {
        return
      }
      //console.log('mayanmctp.match: found Wormhole event on SRC')
      return {
        messages: [
          {
            type: 'cctp-v1.Message',
            outbound: messageSent,
            inbound: messageReceived,
          },
          {
            type: 'wormholeCore.MessageFromMayan',
            outbound: logMessagePublished,
            inbound: messageReceived,
          },
        ],
      }
    }
    //console.log('mayanmctp.match: method is bridgedWithoutFee(), no Wormhole event on SRC')
    return {
      messages: [
        {
          type: 'cctp-v1.Message',
          outbound: messageSent,
          inbound: messageReceived,
        },
      ],
    }
  }
}
