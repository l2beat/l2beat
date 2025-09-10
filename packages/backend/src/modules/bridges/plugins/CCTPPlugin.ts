import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
} from './types'

const parseMessageSent = createEventParser('event MessageSent(bytes message)')

const parseV1MessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
)

const parseV2MessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)',
)

export const CCTPv1MessageSent = createBridgeEventType<{
  messageBody: string
  txHash: string
}>('cctpv1.MessageSent')

export const CCTPv2MessageSent = createBridgeEventType<{
  messageBody: string
  txHash: string
}>('cctpv2.MessageSent')

export const CCTPv2BurnMessageSent = createBridgeEventType<{
  hookData: string
  txHash: string
}>('cctpv2.BurnMessageSent')

export const CCTPv1MessageReceived = createBridgeEventType<{
  caller: EthereumAddress
  sourceDomain: number
  nonce: number
  messageBody: string
}>('cctpv1.MessageReceived')

export const CCTPv2MessageReceived = createBridgeEventType<{
  caller: EthereumAddress
  sourceDomain: number
  nonce: number
  sender: EthereumAddress
  finalityThresholdExecuted: number
  messageBody: string
  txHash: string
}>('cctpv2.MessageReceived')

export const CCTPv2BurnMessageReceived = createBridgeEventType<{
  hookData: string
  txHash: string
}>('cctpv2.BurnMessageReceived')

export class CCTPPlugin implements BridgePlugin {
  name = 'CCTPMessageSent'
  chains = ['ethereum', 'arbitrum', 'base']

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      const message = decodeMessage(messageSent.message)
      if (!message) {
        return
      }

      if (message.version === 0) {
        // TODO: is this even correct?
        return CCTPv1MessageSent.create(input.ctx, {
          messageBody: message.messageBody,
          txHash: input.ctx.txHash,
        })
      }

      if (message.version === 1) {
        // TODO: also recipient is TokenBurnMessenger
        const burnMessage = decodeBurnMessage(message.messageBody)
        if (burnMessage) {
          return CCTPv2BurnMessageSent.create(input.ctx, {
            hookData: burnMessage.hookData,
            txHash: input.ctx.txHash,
          })
        }

        return CCTPv2MessageSent.create(input.ctx, {
          messageBody: message.messageBody,
          txHash: input.ctx.txHash,
        })
      }
    }

    const v1MessageReceived = parseV1MessageReceived(input.log, null)
    if (v1MessageReceived) {
      return CCTPv1MessageReceived.create(input.ctx, {
        caller: EthereumAddress(v1MessageReceived.caller),
        sourceDomain: Number(v1MessageReceived.sourceDomain),
        nonce: Number(v1MessageReceived.nonce),
        messageBody: v1MessageReceived.messageBody,
      })
    }

    const v2MessageReceived = parseV2MessageReceived(input.log, null)
    if (v2MessageReceived) {
      // TODO: also recipient is TokenBurnMessenger
      const burnMessage = decodeBurnMessage(v2MessageReceived.messageBody)
      if (burnMessage) {
        return CCTPv2BurnMessageReceived.create(input.ctx, {
          hookData: burnMessage.hookData,
          txHash: input.ctx.txHash,
        })
      }

      return CCTPv2MessageReceived.create(input.ctx, {
        caller: EthereumAddress(v2MessageReceived.caller),
        sourceDomain: Number(v2MessageReceived.sourceDomain),
        nonce: Number(v2MessageReceived.nonce),
        sender: EthereumAddress(v2MessageReceived.sender),
        finalityThresholdExecuted: Number(
          v2MessageReceived.finalityThresholdExecuted,
        ),
        messageBody: v2MessageReceived.messageBody,
        txHash: input.ctx.txHash,
      })
    }
  }

  match(
    messageReceived: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (CCTPv1MessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv1MessageSent, {
        messageBody: messageReceived.args.messageBody,
      })
      if (!messageSent) {
        return
      }

      return {
        messages: [
          {
            type: 'cctpv1.Message',
            inbound: messageReceived,
            outbound: messageSent,
          },
        ],
      }
    }

    if (CCTPv2MessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv2MessageSent, {
        messageBody: messageReceived.args.messageBody,
      })
      if (!messageSent) {
        return
      }

      return {
        messages: [
          {
            type: 'cctpv2.Message',
            inbound: messageReceived,
            outbound: messageSent,
          },
        ],
      }
    }

    if (CCTPv2BurnMessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv2BurnMessageSent, {
        hookData: messageReceived.args.hookData,
      })
      if (!messageSent) {
        return
      }

      return {
        messages: [
          {
            type: 'cctpv2.BurnMessage',
            inbound: messageReceived,
            outbound: messageSent,
          },
        ],
      }
    }
  }
}

// https://basescan.org/address/0x7db629f6acc20be49a0a7565c21cc178e9ac21e3#code#F4#L78
export function decodeMessage(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    const nonce = reader.readUint256()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const minFinalityThreshold = reader.readUint32()
    const finalityThresholdExecuted = reader.readUint32()
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
      finalityThresholdExecuted,
      messageBody,
    }
  } catch {
    return undefined
  }
}

export function decodeBurnMessage(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const burnToken = reader.readBytes(32)
    const mintRecipient = reader.readBytes(32)
    const amount = reader.readUint256()
    const messageSender = reader.readBytes(32)
    const maxFee = reader.readUint256()
    const feeExecuted = reader.readUint256()
    const expirationBlock = reader.readUint256()
    const hookData = reader.readRemainingBytes()
    return {
      version,
      burnToken,
      mintRecipient,
      amount,
      messageSender,
      maxFee,
      feeExecuted,
      expirationBlock,
      hookData,
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
