/*
V2 MessageSent Format for TokenMessenger V2:
- version: uint32
- sourceDomain: uint32. // 3
- destinationDomain: uint32. // 0
- nonce: uint256.   // PLACEHOLDER in Sent message ! (0)
- sender: bytes32 (address padded to 32 bytes).  // 0x00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d
- recipient: bytes32 (address padded to 32 bytes). // 0x00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d
- destinationCaller: bytes32 (address padded to 32 bytes) // 0x000000000000000000000000047669ebb4ec165d2bd5e78706e9aede04bf095a
- minFinalityThreshold: uint32 (the minimum finality threshold the sender is willing to accept).  // 1000
- finalityThresholdExecuted: uint32 (the finality threshold that was actually executed, set to 0 in the Sent message). // 0
- messageBody: bytes (the actual message payload, e.g., a BurnMessage)
    - version: uint32
    - burnToken: bytes32
    - mintRecipient: bytes32
    - amount: uint256
    - messageSender: bytes32
    - maxFee: uint256
    - feeExecuted: uint256                 // PLACEHOLDER in Sent message !
    - expirationBlock: uint256             // PLACEHOLDER in Sent message !
    - hookData: bytes (optional data for the receiving app)

CIRCLE Validators changes on-the-fly the feeExecuted and expirationBlock that are placeholders in the Sent message.

V2 ReceiveMessage Format for TokenMessenger V2:
- caller. // 0x047669eBB4EC165d2Bd5E78706E9aede04BF095a
- sourceDomain // 1
- nonce // 0xc4944792b9c7d189f56a99c664965118978e307e1287c25e3a259a50020ae6ed
- sender // 0x00000000000000000000000028b5a0e9c621a5badaa536219b3a228c8168cf5d
- finalityThresholdExecuted // 2000
- messageBody (the same BurnMessage as above, but with feeExecuted and expirationBlock properly set)
    - version: uint32
    - burnToken: bytes32
    - mintRecipient: bytes32
    - amount: uint256
    - messageSender: bytes32
    - maxFee: uint256
    - feeExecuted: uint256
    - expirationBlock: uint256
    - hookData: bytes (optional data for the receiving app)

Matching logic:
- sender should be the same in Sent and Received messages
- srcDomain and dstDomain should match
- messageBody except feeExecuted and expirationBlock should match
This has a problem that the same message sent twice will be identical, however considering that the nonce
is set by Circle validators, it's hard to say how this can be solved by the matching logic only.
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { BinaryReader } from '../../../tools/BinaryReader'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  defineNetworks,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
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

export const CCTPv1MessageSent = createInteropEventType<{
  messageBody: string
  $dstChain: string
}>('cctp-v1.MessageSent')

export const CCTPv1MessageReceived = createInteropEventType<{
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  messageBody: string
}>('cctp-v1.MessageReceived')

export const CCTPv2MessageSent = createInteropEventType<{
  fast: boolean
  app?: string
  hookData?: string
  amount?: string
  tokenAddress?: Address32
  messageHash: string
  $dstChain: string
}>('cctp-v2.MessageSent')

export const CCTPv2MessageReceived = createInteropEventType<{
  app?: string
  hookData?: string
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  sender: EthereumAddress
  finalityThresholdExecuted: number
  messageHash: string
}>('cctp-v2.MessageReceived')

export class CCTPPlugin implements InteropPlugin {
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
          $dstChain: findChain(
            CCTP_NETWORKS,
            (x) => x.cctpdomain,
            Number(message.destinationDomain),
          ),
        })
      }

      if (version === 1) {
        const message = decodeV2Message(messageSent.message)

        if (!message) return
        const burnMessage = decodeBurnMessage(message.messageBody)

        return CCTPv2MessageSent.create(input.ctx, {
          // https://developers.circle.com/cctp/technical-guide#messages-and-finality
          fast: message.minFinalityThreshold <= 1000,
          $dstChain: findChain(
            CCTP_NETWORKS,
            (x) => x.cctpdomain,
            Number(message.destinationDomain),
          ),
          app: burnMessage ? 'TokenMessengerV2' : undefined,
          hookData: burnMessage?.hookData,
          amount: burnMessage?.amount.toString(),
          tokenAddress: burnMessage
            ? Address32.from(burnMessage.burnToken)
            : Address32.ZERO,
          messageHash: hashBurnMessage(message.messageBody),
        })
      }
    }

    const v1MessageReceived = parseV1MessageReceived(input.log, null)
    if (v1MessageReceived) {
      return CCTPv1MessageReceived.create(input.ctx, {
        caller: EthereumAddress(v1MessageReceived.caller),
        $srcChain: findChain(
          CCTP_NETWORKS,
          (x) => x.cctpdomain,
          Number(v1MessageReceived.sourceDomain),
        ),
        nonce: Number(v1MessageReceived.nonce),
        messageBody: v1MessageReceived.messageBody,
      })
    }

    const v2MessageReceived = parseV2MessageReceived(input.log, null)
    if (v2MessageReceived) {
      // TODO: also recipient is TokenBurnMessenger

      if (!v2MessageReceived) return
      const burnMessage = decodeBurnMessage(v2MessageReceived.messageBody)

      return CCTPv2MessageReceived.create(input.ctx, {
        app: burnMessage ? 'TokenMessengerV2' : undefined,
        hookData: burnMessage?.hookData,
        caller: EthereumAddress(v2MessageReceived.caller),
        $srcChain: findChain(
          CCTP_NETWORKS,
          (x) => x.cctpdomain,
          Number(v2MessageReceived.sourceDomain),
        ),
        nonce: Number(v2MessageReceived.nonce),
        sender: EthereumAddress(`0x${v2MessageReceived.sender.slice(-40)}`),
        finalityThresholdExecuted: Number(
          v2MessageReceived.finalityThresholdExecuted,
        ),
        messageHash: hashBurnMessage(v2MessageReceived.messageBody),
      })
    }
  }

  matchTypes = [CCTPv1MessageReceived, CCTPv2MessageReceived]
  match(
    messageReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (CCTPv1MessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv1MessageSent, {
        messageBody: messageReceived.args.messageBody,
      })
      if (!messageSent) return
      return [
        Result.Message('cctp-v1.Message', {
          app: 'unknown',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        }),
      ]
    }

    if (CCTPv2MessageReceived.checkType(messageReceived)) {
      const messageSent = db.find(CCTPv2MessageSent, {
        messageHash: messageReceived.args.messageHash,
      })
      if (!messageSent) return
      return [
        Result.Message(
          messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
          {
            app: 'unknown',
            srcEvent: messageSent,
            dstEvent: messageReceived,
          },
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

export function hashBurnMessage(encodedHex: string) {
  const burnMessage = decodeBurnMessage(encodedHex)
  return solidityKeccak256(
    ['uint32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'uint256', 'bytes'],
    [
      burnMessage?.version,
      burnMessage?.burnToken,
      burnMessage?.mintRecipient,
      burnMessage?.amount,
      burnMessage?.messageSender,
      burnMessage?.maxFee,
      burnMessage?.hookData,
    ],
  )
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
