import { EthereumAddress } from '@l2beat/shared-pure'
import { BinaryReader } from '../BinaryReader'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

export const CCTP_NETWORKS = defineNetworks('cctp', [
  { cctpdomain: 0, chain: 'ethereum' },
  { cctpdomain: 1, chain: 'avalanche' },
  { cctpdomain: 2, chain: 'optimism' },
  { cctpdomain: 3, chain: 'arbitrum' },
  // { cctpdomain: 5, chain: 'solana' },
  { cctpdomain: 6, chain: 'base' },
  { cctpdomain: 7, chain: 'polygonpos' },
  { cctpdomain: 10, chain: 'unichain' },
  { cctpdomain: 11, chain: 'linea' },
])

const parseMessageSent = createEventParser('event MessageSent(bytes message)')

const parseV1MessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)',
)

const parseV2MessageReceived = createEventParser(
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)',
)

export const CCTPv1MessageSent = createBridgeEventType<{
  messageBody: string
  $dstChain: string
}>('cctp-v1.MessageSent')

export const CCTPv1MessageReceived = createBridgeEventType<{
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  messageBody: string
}>('cctp-v1.MessageReceived')

export const CCTPv2MessageSent = createBridgeEventType<{
  fast: boolean
  app?: string
  hookData?: string
  amount?: string
  tokenAddress?: EthereumAddress
  messageBody: string
  $dstChain: string
}>('cctp-v2.MessageSent')

export const CCTPv2MessageReceived = createBridgeEventType<{
  app?: string
  hookData?: string
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  sender: EthereumAddress
  finalityThresholdExecuted: number
  messageBody: string
}>('cctp-v2.MessageReceived')

export class CCTPPlugin implements BridgePlugin {
  name = 'cctp'

  capture(input: LogToCapture) {
    const messageSent = parseMessageSent(input.log, null)
    if (messageSent) {
      const version = decodeMessageVersion(messageSent.message)
      if (version === 0) {
        const message = decodeV1Message(messageSent.message)
        if (!message) return
        return CCTPv1MessageSent.create(input.ctx, {
          messageBody: message.rawBody,
          $dstChain:
            CCTP_NETWORKS.find(
              (n) => n.cctpdomain === Number(message.destinationDomain),
            )?.chain || '???',
        })
      }

      if (version === 1) {
        const message = decodeV2Message(messageSent.message)
        if (!message) return
        const burnMessage = decodeBurnMessage(message.messageBody)
        return CCTPv2MessageSent.create(input.ctx, {
          // https://developers.circle.com/cctp/technical-guide#messages-and-finality
          fast: message.minFinalityThreshold <= 1000,
          $dstChain:
            CCTP_NETWORKS.find(
              (n) => n.cctpdomain === Number(message.destinationDomain),
            )?.chain || '???',
          app: burnMessage ? 'TokenMessengerV2' : undefined,
          hookData: burnMessage?.hookData,
          amount: burnMessage?.amount.toString(),
          tokenAddress: EthereumAddress(
            '0x' + burnMessage?.burnToken?.slice(-40),
          ),
          messageBody: message.messageBody,
        })
      }
    }

    const v1MessageReceived = parseV1MessageReceived(input.log, null)
    if (v1MessageReceived) {
      return CCTPv1MessageReceived.create(input.ctx, {
        caller: EthereumAddress(v1MessageReceived.caller),
        $srcChain:
          CCTP_NETWORKS.find(
            (n) => n.cctpdomain === Number(v1MessageReceived.sourceDomain),
          )?.chain || '???',
        nonce: Number(v1MessageReceived.nonce),
        messageBody: v1MessageReceived.messageBody,
      })
    }

    const v2MessageReceived = parseV2MessageReceived(input.log, null)
    if (v2MessageReceived) {
      // TODO: also recipient is TokenBurnMessenger
      const burnMessage = decodeBurnMessage(v2MessageReceived.messageBody)
      return CCTPv2MessageReceived.create(input.ctx, {
        app: burnMessage ? 'TokenMessengerV2' : undefined,
        hookData: burnMessage?.hookData,
        caller: EthereumAddress(v2MessageReceived.caller),
        $srcChain:
          CCTP_NETWORKS.find(
            (n) => n.cctpdomain === Number(v2MessageReceived.sourceDomain),
          )?.chain || '???',
        nonce: Number(v2MessageReceived.nonce),
        sender: EthereumAddress(`0x${v2MessageReceived.sender.slice(-40)}`),
        finalityThresholdExecuted: Number(
          v2MessageReceived.finalityThresholdExecuted,
        ),
        messageBody: v2MessageReceived.messageBody,
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
      if (!messageSent) return
      return [Result.Message('cctp-v1.Message', [messageSent, messageReceived])]
    }

    if (CCTPv2MessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv2MessageSent, {
        messageBody: messageReceived.args.messageBody,
      })
      if (!messageSent) return
      return [
        Result.Message(
          messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
          [messageSent, messageReceived],
        ),
      ]
    }
  }
}

export function decodeMessageVersion(encodedHex: string) {
  try {
    return new BinaryReader(encodedHex).readUint32()
  } catch {
    return undefined
  }
}

// https://basescan.org/address/0xad09780d193884d503182ad4588450c416d6f9d4#code#L1285
export function decodeV1Message(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    const nonce = reader.readUint64()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const rawBody = reader.readRemainingBytes()
    return {
      version,
      sourceDomain,
      destinationDomain,
      nonce,
      sender,
      recipient,
      destinationCaller,
      rawBody,
    }
  } catch {
    return undefined
  }
}

// https://basescan.org/address/0x7db629f6acc20be49a0a7565c21cc178e9ac21e3#code#F4#L78
export function decodeV2Message(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const sourceDomain = reader.readUint32()
    const destinationDomain = reader.readUint32()
    const nonce = reader.readUint256()
    const sender = reader.readBytes(32)
    const recipient = reader.readBytes(32)
    const destinationCaller = reader.readBytes(32)
    const minFinalityThreshold = reader.readUint32() // only in V2
    const finalityThresholdExecuted = reader.readUint32() // only in V2
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
