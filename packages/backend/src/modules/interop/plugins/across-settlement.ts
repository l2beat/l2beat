import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  OPSTACK_NETWORKS,
  parseSentMessage,
  parseSentMessageExtension1,
  RelayedMessage,
  SentMessage,
} from './opstack/opstack'
import {
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  parseMessageDelivered,
  RedeemScheduled,
} from './orbitstack/orbitstack'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// Across HubPool address on Ethereum
const HUB_POOL = EthereumAddress('0xc186fA914353c44b2E33eBE05f21846F1048bEda')

// Build lookup map from L1CrossDomainMessenger address to network (OpStack)
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// Build lookup map from bridge address to network (OrbitStack)
const ORBIT_BRIDGE_TO_NETWORK = new Map(
  ORBITSTACK_NETWORKS.map((n) => [n.bridge.toString(), n]),
)

// L1 event: MessageRelayed from HubPool + SentMessage combined (OpStack)
const AcrossSettlementRelayedMessageOP = createInteropEventType<{
  chain: string
  msgHash: string
}>('across-settlement.RelayedMessageOP')

// L1 event: MessageRelayed from HubPool + MessageDelivered combined (OrbitStack)
const AcrossSettlementRelayedMessageOrbit = createInteropEventType<{
  chain: string
  messageNum: string
}>('across-settlement.RelayedMessageOrbit')

// Event parser for MessageRelayed from HubPool
// event MessageRelayed(address target, bytes message)
const parseMessageRelayed = createEventParser(
  'event MessageRelayed(address target, bytes message)',
)

export class AcrossSettlementPlugin implements InteropPlugin {
  readonly name = 'across-settlement'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture MessageRelayed from HubPool
      const messageRelayed = parseMessageRelayed(input.log, [HUB_POOL])
      if (messageRelayed) {
        const targetAddress = messageRelayed.target.toLowerCase()
        const currentLogIndex = input.log.logIndex ?? -1

        // The bridge event (SentMessage or MessageDelivered) is always at logIndex - 2
        // Pattern: BridgeEvent (N-2) -> Extension (N-1) -> MessageRelayed (N)
        const bridgeLog = input.txLogs.find(
          (log) => log.logIndex === currentLogIndex - 2,
        )
        if (!bridgeLog) return

        // Try OpStack: Check if bridgeLog is a SentMessage from a known L1CrossDomainMessenger
        const opNetwork = L1_CDM_TO_NETWORK.get(bridgeLog.address)
        if (opNetwork) {
          const sentMessage = parseSentMessage(bridgeLog, [
            opNetwork.l1CrossDomainMessenger,
          ])
          if (
            !sentMessage ||
            sentMessage.target.toLowerCase() !== targetAddress
          )
            return

          // Find SentMessageExtension1 at logIndex - 1
          const extensionLog = input.txLogs.find(
            (log) => log.logIndex === currentLogIndex - 1,
          )
          const extension =
            extensionLog &&
            parseSentMessageExtension1(extensionLog, [
              opNetwork.l1CrossDomainMessenger,
            ])

          const msgHash = hashCrossDomainMessageV1(
            sentMessage.messageNonce,
            sentMessage.sender,
            sentMessage.target,
            extension?.value ?? 0n,
            sentMessage.gasLimit,
            sentMessage.message,
          )

          return [
            AcrossSettlementRelayedMessageOP.create(input, {
              chain: opNetwork.chain,
              msgHash,
            }),
          ]
        }

        // Try OrbitStack: Check if bridgeLog is a MessageDelivered from a known Arbitrum bridge
        const orbitNetwork = ORBIT_BRIDGE_TO_NETWORK.get(bridgeLog.address)
        if (orbitNetwork) {
          const messageDelivered = parseMessageDelivered(bridgeLog, [
            orbitNetwork.bridge,
          ])
          if (!messageDelivered) return

          return [
            AcrossSettlementRelayedMessageOrbit.create(input, {
              chain: orbitNetwork.chain,
              messageNum: messageDelivered.messageIndex.toString(),
            }),
          ]
        }
      }
    }
    // No L2 event capture - we match on opstack's RelayedMessage or orbitstack's RedeemScheduled
  }

  // Match on opstack's RelayedMessage or orbitstack's RedeemScheduled
  matchTypes = [RelayedMessage, RedeemScheduled]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // OpStack matching
    if (RelayedMessage.checkType(event)) {
      // Check if there's a corresponding AcrossSettlementRelayedMessageOP
      const acrossEvent = db.find(AcrossSettlementRelayedMessageOP, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!acrossEvent) return

      // Also find underlying OpStack SentMessage
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'across-settlement',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [acrossEvent],
        }),
      ]

      // If ETH was sent via CrossDomainMessenger, also create a Transfer
      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('across-settlement.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [acrossEvent],
          }),
        )
      }

      return results
    }

    // OrbitStack matching
    if (RedeemScheduled.checkType(event)) {
      // Check if there's a corresponding AcrossSettlementRelayedMessageOrbit
      const acrossEvent = db.find(AcrossSettlementRelayedMessageOrbit, {
        messageNum: event.args.messageNum,
        chain: event.args.chain,
      })
      if (!acrossEvent) return

      // Also find underlying OrbitStack MessageDelivered
      const messageDelivered = db.find(MessageDelivered, {
        messageNum: event.args.messageNum,
        chain: event.args.chain,
      })
      if (!messageDelivered) return

      const results: MatchResult = [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'across-settlement',
          srcEvent: messageDelivered,
          dstEvent: event,
          extraEvents: [acrossEvent],
        }),
      ]

      // If ETH was sent, also create a Transfer
      if (event.args.ethAmount) {
        results.push(
          Result.Transfer('across-settlement.L1ToL2Transfer', {
            srcEvent: messageDelivered,
            srcAmount: messageDelivered.args.txValue,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: event.args.ethAmount,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [acrossEvent],
          }),
        )
      }

      return results
    }
  }
}
