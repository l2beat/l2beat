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
  type EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../../engine/config/InteropConfigStore'
import { isMayanCctpForwarded, MayanForwarded } from '../mayan-forwarder'
import { OrderFulfilled } from '../mayan-mctp-fast'
import { findWrappedMayanWormholeLog } from '../mayan-wormhole'
import {
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
import { LogMessagePublished } from '../wormhole/wormhole.plugin'
import { CCTPV2Config } from './cctp.config'
import {
  cctpMessageSentLog,
  cctpTransferLog,
  cctpV2MessageReceivedLog,
  decodeMessageVersion,
  decodeV2Message,
  decodeV2MessageBody,
  hashV2MessageBody,
  parseCctpMessageSent,
  parseCctpV2ReceivedTransfer,
} from './cctp.utils'

// Some HyperEVM system-origin CCTP burns, e.g. Hyperliquid CoreDepositWallet
// withdrawals, are present in transaction/block receipts but missing from
// eth_getLogs. Keep HyperEVM as a received-only fallback for those CCTP legs.
const CCTP_V2_ONE_SIDED_SOURCE_CHAINS = new Set(['hyperevm'])

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

  constructor(
    private configs: InteropConfigStore,
    private oneSidedChains: string[] = [],
  ) {}

  getDataRequests(): DataRequest[] {
    const networks = this.configs.get(CCTPV2Config)
    if (!networks) return []

    const addresses: ChainSpecificAddress[] = []
    for (const network of networks) {
      if (
        !network.messageTransmitter ||
        this.oneSidedChains.includes(network.chain)
      ) {
        continue
      }
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
        signature: cctpMessageSentLog,
        addresses,
      },
      {
        type: 'event',
        signature: cctpV2MessageReceivedLog,
        includeTxEvents: [cctpTransferLog],
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

    const messageSent = parseCctpMessageSent(input.log, [
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

    const v2MessageReceived = parseCctpV2ReceivedTransfer(input, networks)
    if (v2MessageReceived) {
      return [
        CCTPv2MessageReceived.create(input, {
          app: v2MessageReceived.app,
          hookData: v2MessageReceived.hookData,
          caller: v2MessageReceived.caller,
          $srcChain: v2MessageReceived.srcChain,
          nonce: v2MessageReceived.nonce,
          sender: v2MessageReceived.sender,
          finalityThresholdExecuted:
            v2MessageReceived.finalityThresholdExecuted,
          messageHash: v2MessageReceived.messageHash,
          dstTokenAddress: v2MessageReceived.dstTokenAddress,
          dstAmount: v2MessageReceived.dstAmount,
        }),
      ]
    }
  }

  matchTypes = [CCTPv2MessageSent, CCTPv2MessageReceived]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (CCTPv2MessageReceived.checkType(event)) {
      // the sort makes our matching deterministic
      const messageSentMatches = db.findAll(CCTPv2MessageSent, {
        messageHash: event.args.messageHash,
      })
      if (messageSentMatches.length === 0) {
        const srcChain = event.args.$srcChain
        if (!this.isOneSidedSourceChain(srcChain)) return

        return [
          Result.Transfer('cctp-v2.Transfer', {
            srcChain,
            dstEvent: event,
            dstTokenAddress: event.args.dstTokenAddress,
            dstAmount: event.args.dstAmount,
            srcWasBurned: true,
            dstWasMinted: true,
            bridgeType: 'burnAndMint',
          }),
        ]
      }
      const messageSent = messageSentMatches.sort(
        (a, b) => a.ctx.timestamp - b.ctx.timestamp,
      )[0]

      const wrappers: MatchResult = []
      const mayanForwarded = db
        .findAll(MayanForwarded, { sameTxAfter: messageSent })
        .find(isMayanCctpForwarded)
      const orderFulfilled = db.find(OrderFulfilled, {
        sameTxAfter: event,
      })
      if (mayanForwarded) {
        const mayanWrappedWormholeLog = findWrappedMayanWormholeLog(
          db,
          mayanForwarded,
          LogMessagePublished,
        )
        wrappers.push(
          Result.Message('mayan.Message', {
            app: 'mctp',
            srcEvent: mayanForwarded,
            // Keep Mayan message detection anchored to source forwarder event.
            // Consume only extra events that are confidently part of Mayan wrapping.
            dstEvent: event,
            extraEvents: [
              ...(mayanWrappedWormholeLog ? [mayanWrappedWormholeLog] : []),
              ...(orderFulfilled ? [orderFulfilled] : []),
            ],
          }),
        )
      }

      return [
        ...wrappers,
        Result.Message(
          messageSent.args.fast ? 'cctp-v2.FastMessage' : 'cctp-v2.SlowMessage',
          {
            app: 'cctp-v2',
            srcEvent: messageSent,
            dstEvent: event,
          },
        ),
        Result.Transfer('cctp-v2.Transfer', {
          srcEvent: messageSent,
          srcTokenAddress: messageSent.args.tokenAddress,
          srcAmount: messageSent.args.amount,
          dstEvent: event,
          dstTokenAddress: event.args.dstTokenAddress,
          dstAmount: event.args.dstAmount,
          srcWasBurned: true,
          dstWasMinted: true,
          bridgeType: 'burnAndMint',
        }),
      ]
    }

    if (CCTPv2MessageSent.checkType(event)) {
      const hasCounterpart =
        db.findAll(CCTPv2MessageReceived, {
          messageHash: event.args.messageHash,
        }).length > 0
      if (hasCounterpart) return

      const dstChain = event.args.$dstChain
      if (!this.oneSidedChains.includes(dstChain)) return

      return [
        Result.Transfer('cctp-v2.Transfer', {
          srcEvent: event,
          dstChain,
          srcTokenAddress: event.args.tokenAddress,
          srcAmount: event.args.amount,
          srcWasBurned: true,
          dstWasMinted: true,
          bridgeType: 'burnAndMint',
        }),
      ]
    }
  }

  private isOneSidedSourceChain(chain: string) {
    return (
      this.oneSidedChains.includes(chain) ||
      CCTP_V2_ONE_SIDED_SOURCE_CHAINS.has(chain)
    )
  }
}
