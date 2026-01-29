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

import {
  Address32,
  assert,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { solidityKeccak256 } from 'ethers/lib/utils'
import { BinaryReader } from '../../../../tools/BinaryReader'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import { CCTPV2Config } from './cctp.config'

const messageSentLog = 'event MessageSent(bytes message)'
const parseMessageSent = createEventParser(messageSentLog)

const v2MessageReceivedLog =
  'event MessageReceived(address indexed caller, uint32 sourceDomain, bytes32 indexed nonce, bytes32 sender, uint32 indexed finalityThresholdExecuted, bytes messageBody)'
const parseV2MessageReceived = createEventParser(v2MessageReceivedLog)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'
const parseTransfer = createEventParser(transferLog)

export const CCTPv2MessageSent = createInteropEventType<{
  fast: boolean
  app?: string
  hookData?: string
  amount?: bigint
  tokenAddress?: Address32
  messageHash: string
  $dstChain: string
}>('cctp-v2.MessageSent', { direction: 'outgoing' })

export const CCTPv2MessageReceived = createInteropEventType<{
  app?: string
  hookData?: string
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  sender: EthereumAddress
  finalityThresholdExecuted: number
  messageHash: string
  dstTokenAddress?: Address32
  dstAmount?: bigint
}>('cctp-v2.MessageReceived', { direction: 'incoming' })

export class CCTPV2Plugin implements InteropPluginResyncable {
  readonly name = 'cctp-v2'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(CCTPV2Config)
    if (!networks) return []

    const addresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (!network.messageTransmitter) continue
      try {
        addresses.push(
          ChainSpecificAddress.fromLong(network.chain, network.messageTransmitter),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: messageSentLog,
        addresses,
      },
      {
        type: 'event',
        signature: v2MessageReceivedLog,
        includeTxEvents: [transferLog],
        addresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(CCTPV2Config)
    if (!networks) return

    const network = networks.find((n) => n.chain === input.chain)
    if (!network) return
    assert(
      network.messageTransmitter,
      'We capture only chain with message transmitters',
    )

    const messageSent = parseMessageSent(input.log, [
      network.messageTransmitter,
    ])
    if (messageSent) {
      const version = decodeMessageVersion(messageSent.message)

      if (version === 1) {
        const message = decodeV2Message(messageSent.message)

        if (!message) return
        const burnMessage = decodeV2MessageBody(message.messageBody)
        const messageHash = hashV2MessageBody(message.messageBody)
        if (!messageHash) return

        return [
          CCTPv2MessageSent.create(input, {
            // https://developers.circle.com/cctp/technical-guide#messages-and-finality
            fast: message.minFinalityThreshold <= 1000,
            $dstChain: findChain(
              networks,
              (x) => x.domain,
              Number(message.destinationDomain),
            ),
            app: burnMessage ? 'TokenMessengerV2' : undefined,
            hookData: burnMessage?.hookData,
            amount: burnMessage?.amount,
            tokenAddress: burnMessage
              ? Address32.from(burnMessage.burnToken)
              : undefined,
            messageHash,
          }),
        ]
      }
    }

    const v2MessageReceived = parseV2MessageReceived(input.log, [
      network.messageTransmitter,
    ])
    if (v2MessageReceived) {
      const messageBody = decodeV2MessageBody(v2MessageReceived.messageBody)
      const messageHash = hashV2MessageBody(v2MessageReceived.messageBody)
      if (!messageHash) return

      const previouspreviousLog = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 2,
      )
      const fourback = input.txLogs.find(
        // biome-ignore lint/style/noNonNullAssertion: It's there
        (x) => x.logIndex === input.log.logIndex! - 4,
      )
      const transfer =
        previouspreviousLog && parseTransfer(previouspreviousLog, null)
      const fallbackTransfer = fourback && parseTransfer(fourback, null)
      let dstAmount = transfer?.value
      if (
        fallbackTransfer?.value !== undefined &&
        fallbackTransfer.value > (transfer?.value ?? 0)
      ) {
        dstAmount = fallbackTransfer.value
      }
      return [
        CCTPv2MessageReceived.create(input, {
          app: messageBody ? 'TokenMessengerV2' : undefined,
          hookData: messageBody?.hookData,
          caller: EthereumAddress(v2MessageReceived.caller),
          $srcChain: findChain(
            networks,
            (x) => x.domain,
            Number(v2MessageReceived.sourceDomain),
          ),
          nonce: Number(v2MessageReceived.nonce),
          sender: EthereumAddress(`0x${v2MessageReceived.sender.slice(-40)}`),
          finalityThresholdExecuted: Number(
            v2MessageReceived.finalityThresholdExecuted,
          ),
          messageHash,
          dstTokenAddress: previouspreviousLog
            ? Address32.from(previouspreviousLog.address)
            : undefined,
          dstAmount,
        }),
      ]
    }
  }

  matchTypes = [CCTPv2MessageReceived]
  match(
    messageReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (CCTPv2MessageReceived.checkType(messageReceived)) {
      // the sort makes our matching deterministic
      const messageSentMatches = db.findAll(CCTPv2MessageSent, {
        messageHash: messageReceived.args.messageHash,
      })
      if (messageSentMatches.length === 0) return
      const messageSent = messageSentMatches.sort(
        (a, b) => a.ctx.timestamp - b.ctx.timestamp,
      )[0]
      return [
        Result.Message(
          messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
          {
            app: 'cctp-v2',
            srcEvent: messageSent,
            dstEvent: messageReceived,
          },
        ),
        Result.Transfer('cctp-v2.Transfer', {
          srcEvent: messageSent,
          srcTokenAddress: messageSent.args.tokenAddress,
          srcAmount: messageSent.args.amount,
          dstEvent: messageReceived,
          dstTokenAddress: messageReceived.args.dstTokenAddress,
          dstAmount: messageReceived.args.dstAmount,
          srcWasBurned: true,
          dstWasMinted: true,
        }),
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

export function hashV2MessageBody(encodedHex: string): string | undefined {
  const messageBody = decodeV2MessageBody(encodedHex)
  if (!messageBody) return undefined
  return solidityKeccak256(
    ['uint32', 'bytes32', 'bytes32', 'uint256', 'bytes32', 'uint256', 'bytes'],
    [
      messageBody.version,
      messageBody.burnToken,
      messageBody.mintRecipient,
      messageBody.amount,
      messageBody.messageSender,
      messageBody.maxFee,
      messageBody.hookData,
    ],
  )
}

export function decodeV2MessageBody(encodedHex: string) {
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
