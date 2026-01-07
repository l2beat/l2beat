import { EthereumAddress } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  OPSTACK_NETWORKS,
  parseSentMessage,
  parseSentMessageExtension1,
  RelayedMessage,
  SentMessage,
} from './opstack/opstack'
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

// Build lookup map from L1CrossDomainMessenger address to network
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// L1 event: MessageRelayed from HubPool + SentMessage combined
const AcrossSettlementSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('across-settlement.SentMessage')

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

        // Find SentMessage from any known L1CrossDomainMessenger with matching target
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
      }
    }
    // No L2 event capture - we match on opstack's RelayedMessage
  }

  // Match on opstack's RelayedMessage
  matchTypes = [RelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
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

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'across-settlement',
          srcEvent: sentMessage,
          dstEvent: event,
        }),
      ]
    }
  }
}
