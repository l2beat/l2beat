import { EthereumAddress } from '@l2beat/shared-pure'
import {
  createEventParser,
  createEventType,
  type Event,
  type EventDb,
  type LogToDecode,
  type MatchResult,
  type Plugin,
} from './types'

const parseMessageSent = createEventParser('event MessageSent(bytes message)')

const parseMessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
)

export const MessageSent = createEventType<{
  message: string
  txHash: string
}>('cctpv1.MessageSent')

export const MessageReceived = createEventType<{
  caller: EthereumAddress
  sourceDomain: number
  nonce: number
  messageBody: string
}>('cctpv1.MessageReceived')

export class CCTPv1Plugin implements Plugin {
  name = 'cctpv1'

  decode(input: LogToDecode) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      return MessageSent.create(input.tx, {
        message: extractRawBody(messageSent.message),
        txHash: input.tx.hash,
      })
    }

    const messageReceived = parseMessageReceived(input.log, null)
    if (messageReceived) {
      return MessageReceived.create(input.tx, {
        caller: EthereumAddress(messageReceived.caller),
        sourceDomain: Number(messageReceived.sourceDomain),
        nonce: Number(messageReceived.nonce),
        messageBody: messageReceived.messageBody,
      })
    }
  }

  match(event: Event, db: EventDb): MatchResult | undefined {
    if (!MessageReceived.checkType(event)) {
      return
    }

    const outboundEvent = db.find(MessageSent, {
      message: event.args.messageBody,
    })
    if (!outboundEvent) {
      return
    }

    return {
      message: {
        type: 'cctpv1.Message',
        inbound: event,
        outbound: outboundEvent,
      },
    }
  }
}

// https://basescan.org/address/0xad09780d193884d503182ad4588450c416d6f9d4#code#L1296
function extractRawBody(encodedMessage: string) {
  const hex = encodedMessage.startsWith('0x')
    ? encodedMessage.slice(2)
    : encodedMessage

  return '0x' + Buffer.from(hex, 'hex').subarray(116).toString('hex')
}
