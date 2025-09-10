import { MessageReceived, MessageSent } from './cctpv1'
import type {
  BridgeEvent,
  BridgeEventDb,
  BridgePlugin,
  MatchResult,
} from './types'
import { LogMessagePublished } from './wormhole'

export class MayanPlugin implements BridgePlugin {
  name = 'mayan'
  chains = ['ethereum', 'arbitrum', 'base']

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!MessageReceived.checkType(event)) {
      return
    }

    const messageSent = db.find(MessageSent, {
      message: event.args.messageBody,
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
          type: 'cctpv1.Message',
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
