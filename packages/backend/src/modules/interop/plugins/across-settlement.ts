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
const AcrossSettlementSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('across-settlement.SentMessage')

// L1 event: MessageRelayed from HubPool + MessageDelivered combined (OrbitStack)
const AcrossSettlementMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
}>('across-settlement.MessageDelivered')

// Event parser for MessageRelayed from HubPool
// event MessageRelayed(address target, bytes message)
const parseMessageRelayed = createEventParser(
  'event MessageRelayed(address target, bytes message)',
)

export class AcrossSettlementPlugin implements InteropPlugin {
  name = 'across-settlement'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture MessageRelayed from HubPool
      const messageRelayed = parseMessageRelayed(input.log, [HUB_POOL])
      if (messageRelayed) {
        const targetAddress = messageRelayed.target.toLowerCase()

        // Try OpStack: Find SentMessage from any known L1CrossDomainMessenger with matching target
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(log.address)
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            network.l1CrossDomainMessenger,
          ])
          if (
            !sentMessage ||
            sentMessage.target.toLowerCase() !== targetAddress
          )
            continue

          // Find SentMessageExtension1
          const nextLog = input.txLogs.find(
            // biome-ignore lint/style/noNonNullAssertion: It's there
            (x) => x.logIndex === log.logIndex! + 1,
          )
          const extension =
            nextLog &&
            parseSentMessageExtension1(nextLog, [
              network.l1CrossDomainMessenger,
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
            AcrossSettlementSentMessage.create(input, {
              chain: network.chain,
              msgHash,
            }),
          ]
        }

        // Try OrbitStack: Find MessageDelivered from any known Arbitrum bridge
        for (const log of input.txLogs) {
          const network = ORBIT_BRIDGE_TO_NETWORK.get(log.address)
          if (!network) continue

          const messageDelivered = parseMessageDelivered(log, [network.bridge])
          if (!messageDelivered) continue

          return [
            AcrossSettlementMessageDelivered.create(input, {
              chain: network.chain,
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
      // Check if there's a corresponding AcrossSettlementSentMessage
      const acrossEvent = db.find(AcrossSettlementSentMessage, {
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
          }),
        )
      }

      return results
    }

    // OrbitStack matching
    if (RedeemScheduled.checkType(event)) {
      // Check if there's a corresponding AcrossSettlementMessageDelivered
      const acrossEvent = db.find(AcrossSettlementMessageDelivered, {
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
          }),
        )
      }

      return results
    }
  }
}
