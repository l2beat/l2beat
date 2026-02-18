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
import { BinaryReader } from '../../../../tools/BinaryReader'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { findBestTransferLog } from '../hyperlane-hwr'
import { MayanForwarded } from '../mayan-forwarder'
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
import { findWrappedMayanWormholeLog } from '../wormhole/wormhole.plugin'
import { CCTPV1Config } from './cctp.config'

const messageSentLog = 'event MessageSent(bytes message)'
const parseMessageSent = createEventParser(messageSentLog)

const v1MessageReceivedLog =
  'event MessageReceived(address indexed caller, uint32 sourceDomain, uint64 indexed nonce, bytes32 sender, bytes messageBody)'
const parseV1MessageReceived = createEventParser(v1MessageReceivedLog)

const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

export const CCTPv1MessageSent = createInteropEventType<{
  messageBody: string
  $dstChain: string
  srcTokenAddress?: Address32
  srcAmount?: bigint
}>('cctp-v1.MessageSent', { direction: 'outgoing' })

export const CCTPv1MessageReceived = createInteropEventType<{
  caller: EthereumAddress
  $srcChain: string
  nonce: number
  messageBody: string
  dstTokenAddress?: Address32
  dstAmount?: bigint
}>('cctp-v1.MessageReceived', { direction: 'incoming' })

export class CCTPV1Plugin implements InteropPluginResyncable {
  readonly name = 'cctp-v1'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(CCTPV1Config)
    if (!networks) return []

    const addresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (!network.messageTransmitter) continue
      try {
        addresses.push(
          ChainSpecificAddress.fromLong(
            network.chain,
            network.messageTransmitter,
          ),
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
        signature: v1MessageReceivedLog,
        includeTxEvents: [transferLog],
        addresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const networks = this.configs.get(CCTPV1Config)
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
      if (version === 0) {
        const message = decodeV1Message(messageSent.message)
        if (!message) return
        const messageBody = decodeV1MessageBody(message.rawBody)
        return [
          CCTPv1MessageSent.create(input, {
            messageBody: message.rawBody,
            $dstChain: findChain(
              networks,
              (x) => x.domain,
              Number(message.destinationDomain),
            ),
            srcTokenAddress: messageBody
              ? Address32.from(messageBody.burnToken)
              : undefined,
            srcAmount: messageBody?.amount ?? undefined,
          }),
        ]
      }
    }

    const v1MessageReceived = parseV1MessageReceived(input.log, [
      network.messageTransmitter,
    ])
    if (v1MessageReceived) {
      const messageBody = decodeV1MessageBody(v1MessageReceived.messageBody) // only encodes the source token, so no value to us
      const transferMatch = findBestTransferLog(
        input.txLogs,
        messageBody?.amount ?? 0n,
        input.log.logIndex ?? -1,
      )
      return [
        CCTPv1MessageReceived.create(input, {
          caller: EthereumAddress(v1MessageReceived.caller),
          $srcChain: findChain(
            networks,
            (x) => x.domain,
            Number(v1MessageReceived.sourceDomain),
          ),
          nonce: Number(v1MessageReceived.nonce),
          messageBody: v1MessageReceived.messageBody,
          dstTokenAddress: transferMatch.transfer
            ? Address32.from(transferMatch.transfer.logAddress)
            : undefined,
          dstAmount: transferMatch.transfer?.value ?? undefined,
        }),
      ]
    }
  }

  matchTypes = [CCTPv1MessageReceived]
  match(
    messageReceived: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    const networks = this.configs.get(CCTPV1Config)
    if (!networks) return
    const network = networks.find((n) => n.chain === messageReceived.ctx.chain)
    if (!network) return
    if (CCTPv1MessageReceived.checkType(messageReceived)) {
      // findAll and use oldest for determinism
      // there are bots like https://etherscan.io/address/0xfd62020cee216dc543e29752058ee9f60f7d9ff9#tokentxns
      // who always use the same messageBody
      const messageSentMatches = db.findAll(CCTPv1MessageSent, {
        messageBody: messageReceived.args.messageBody,
      })
      if (messageSentMatches.length === 0) return
      const messageSent = messageSentMatches.sort(
        (a, b) => a.ctx.timestamp - b.ctx.timestamp,
      )[0]
      const wrappers: MatchResult = []
      const mayanForwarded = db.find(MayanForwarded, {
        sameTxAfter: messageSent,
      })
      if (mayanForwarded) {
        const mayanWrappedWormholeLog = findWrappedMayanWormholeLog(
          db,
          mayanForwarded,
        )
        wrappers.push(
          Result.Message('mayan.Message', {
            app: 'mctp',
            srcEvent: mayanForwarded,
            dstEvent: messageReceived,
            extraEvents: mayanWrappedWormholeLog
              ? [mayanWrappedWormholeLog]
              : undefined,
          }),
        )
      }
      return [
        ...wrappers,
        Result.Message('cctp-v1.Message', {
          app: 'cctp-v1',
          srcEvent: messageSent,
          dstEvent: messageReceived,
        }),
        Result.Transfer('cctp-v1.Transfer', {
          srcEvent: messageSent,
          srcTokenAddress: messageSent.args.srcTokenAddress,
          srcAmount: messageSent.args.srcAmount,
          dstEvent: messageReceived,
          dstTokenAddress: messageReceived.args.dstTokenAddress,
          dstAmount: messageReceived.args.dstAmount,
          srcWasBurned: true,
          dstWasMinted: true,
          bridgeType: 'burnAndMint',
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

// https://developers.circle.com/cctp/v1/message-format
export function decodeV1MessageBody(encodedHex: string) {
  try {
    const reader = new BinaryReader(encodedHex)
    const version = reader.readUint32()
    const burnToken = reader.readBytes(32)
    const mintRecipient = reader.readBytes(32)
    const amount = reader.readUint256()
    const messageSender = reader.readBytes(32)
    return {
      version,
      burnToken,
      mintRecipient,
      amount,
      messageSender,
    }
  } catch {
    return undefined
  }
}
