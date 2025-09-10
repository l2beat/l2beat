import { EthereumAddress } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'
import { BinaryReader } from '../BinaryReader'

// same as cctpv1
const parseMessageSent = createEventParser('event MessageSent(bytes message)')

// extra field compared to cctpv1
const parseMessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)',
)


export const MessageSent = createBridgeEventType<{
  message: string
  txHash: string
}>('cctpv2.MessageSent')

export const MessageReceived = createBridgeEventType<{
  caller: EthereumAddress
  sourceDomain: number
  nonce: number
  finalityThresholdExecuted: number
  messageBody: string
  txHash: string
}>('cctpv2.MessageReceived')

export class CCTPv2Plugin implements BridgePlugin {
  name = 'cctpv2'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      const message = decodeMessage(messageSent.message)
      if (message && message.version === 1) {
        console.log(message)
        return MessageSent.create(input.ctx, {
          message: message.messageBody,
          txHash: input.ctx.txHash,
        })
      }
    }

    const messageReceived = parseMessageReceived(input.log, null)
    if (messageReceived) {
      return MessageReceived.create(input.ctx, {
        caller: EthereumAddress(messageReceived.caller),
        sourceDomain: Number(messageReceived.sourceDomain),
        nonce: Number(messageReceived.nonce),
        finalityThresholdExecuted: Number(messageReceived.finalityThresholdExecuted),
        messageBody: messageReceived.messageBody,
        txHash: input.ctx.txHash
      })
    }
  }

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
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
      messages: [
        {
          type: 'cctpv2.Message',
          inbound: event,
          outbound: outboundEvent,
        },
      ],
    }
  }
}

// https://basescan.org/address/0x7db629f6acc20be49a0a7565c21cc178e9ac21e3#code#F4#L78
function decodeMessage(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    // reader.skipBytes(32) // EMPTY_NONCE
    const nonce = reader.readUint256()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const minFinalityThreshold = reader.readUint32()
    reader.skipBytes(4) // EMPTY_FINALITY_THRESHOLD_EXECUTED
    const messageBody = reader.readRemainingBytes()
    return {
      version,
      sourceDomain,
      destinationDomain,
      nonce,
      sender,
      recipient,
      destinationCaller,
      minFinalityThreshold,
      messageBody,
    }
  } catch {
    return undefined
  }
}

/*
00000001 // version
00000000 // sourceDomain
00000006 // destinationDomain
0000000000000000000000000000000000000000000000000000000000000000 // nonce
00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d // sender
00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d // recipient
000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741 // destinationCaller
00000001 // minFinalityThreshold
00000000 // EMPTY_FINALITY_THRESHOLD_EXECUTED
00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000003000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00

00000001000000000000000000000000a0b86991c6218b36c1d19d4a2e9eb0ce3606eb48000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e77410000000000000000000000000000000000000000000000000000000026cad397000000000000000000000000c1062b7c5dc8e4b1df9f200fe360cdc0ed6e7741000000000000000000000000000000000000000000000000000000000001164a000000000000000000000000000000000000000000000000000000000000fe3a0000000000000000000000000000000000000000000000000000000002119c3303000000000000000000000000d913224f619b1fb1d377ed77eb1f5fb61d2c51c300000000000000000000000000000000000000000000000000000000000000000000000000d7f4a70000000000000000000000000002f0d2000000000000d4d70000000068ac554d000000000000000000000000a5aa6e2171b416e1d27ec53ca8c13db3f91a89cd00
*/