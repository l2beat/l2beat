import { EthereumAddress } from '@l2beat/shared-pure'
import { MessageReceived, MessageSent } from './cctpv1'
import {
  createEventParser,
  createEventType,
  type Event,
  type EventDb,
  type LogToDecode,
  type MatchResult,
  type Plugin,
} from './types'
import { LogMessagePublished } from './wormhole'

const parseForwardedERC20 = createEventParser(
  'event ForwardedERC20(address token, uint256 amount, address mayanProtocol, bytes protocolData)',
)

export const ForwardedERC20 = createEventType<{
  token: EthereumAddress
  amount: string
  mayanProtocol: EthereumAddress
  protocolData: string
}>('mayan.ForwardedERC20')

export class MayanPlugin implements Plugin {
  name = 'mayan'

  decode(input: LogToDecode) {
    const parsed = parseForwardedERC20(input.log, null)
    if (!parsed) {
      return
    }

    return ForwardedERC20.create(input.tx, {
      token: EthereumAddress(parsed.token),
      amount: parsed.amount.toString(),
      mayanProtocol: EthereumAddress(parsed.mayanProtocol),
      protocolData: parsed.protocolData,
    })
  }

  match(event: Event, db: EventDb): MatchResult | undefined {
    if (!LogMessagePublished.checkType(event)) {
      return
    }

    const messageSent = db.find(MessageSent, {
      txHash: event.tx.hash,
    })
    if (!messageSent) {
      return
    }

    const inboundEvent = db.find(MessageReceived, {
      messageBody: messageSent.args.message,
    })
    if (!inboundEvent) {
      return
    }

    return {
      message: {
        type: 'mayan.WormholeMessage',
        inbound: inboundEvent,
        outbound: event,
      },
    }
  }
}
