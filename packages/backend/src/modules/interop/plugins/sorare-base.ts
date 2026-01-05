import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  parseRelayedMessage,
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

// Contract addresses
const L1_SORARE_BRIDGE = EthereumAddress(
  '0xDAB785F7719108390A26ff8d167e40aE4789F8D7',
)
const L2_SORARE_BRIDGE = EthereumAddress(
  '0xba78a06459a85b6d01a613294fe91cf9ce8326cb',
)
const L1_CROSS_DOMAIN_MESSENGER = EthereumAddress(
  '0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
)
const L2_CROSS_DOMAIN_MESSENGER = EthereumAddress(
  '0x4200000000000000000000000000000000000007',
)

// L1 event: TransferRegistered + SentMessage combined
const SorareTransferRegisteredSentMessage = createInteropEventType<{
  msgHash: string
  ticketHash: string
  amount: bigint
}>('sorare-base.TransferRegisteredSentMessage')

// L2 event: FactRegistered + RelayedMessage combined
const SorareFactRegisteredRelayedMessage = createInteropEventType<{
  msgHash: string
  ticketHash: string
}>('sorare-base.FactRegisteredRelayedMessage')

// Event parsers
// Note: ticketHash is NOT indexed (in data), sender IS indexed (in topics)
const parseTransferRegistered = createEventParser(
  'event TransferRegistered(bytes32 ticketHash, address indexed sender, address recipient, uint256 amount, bytes32 messageHash)',
)

const parseFactRegistered = createEventParser(
  'event FactRegistered(bytes32 ticketHash)',
)

export class SorareBasePlugin implements InteropPlugin {
  name = 'sorare-base'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture TransferRegistered + SentMessage
      const transferRegistered = parseTransferRegistered(input.log, [
        L1_SORARE_BRIDGE,
      ])
      if (transferRegistered) {
        // Find SentMessage in same tx
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [L1_CROSS_DOMAIN_MESSENGER])
          return parsed !== undefined
        })
        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            L1_CROSS_DOMAIN_MESSENGER,
          ])
          if (sentMessage) {
            // Find SentMessageExtension1
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === sentMessageLog.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [L1_CROSS_DOMAIN_MESSENGER])

            const msgHash = hashCrossDomainMessageV1(
              sentMessage.messageNonce,
              sentMessage.sender,
              sentMessage.target,
              extension?.value ?? 0n,
              sentMessage.gasLimit,
              sentMessage.message,
            )

            return [
              SorareTransferRegisteredSentMessage.create(input, {
                msgHash,
                ticketHash: transferRegistered.ticketHash,
                amount: transferRegistered.amount,
              }),
            ]
          }
        }
      }
    } else if (input.chain === 'base') {
      // L2: Capture FactRegistered + RelayedMessage
      const factRegistered = parseFactRegistered(input.log, [L2_SORARE_BRIDGE])
      if (factRegistered) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [L2_CROSS_DOMAIN_MESSENGER])
          return parsed !== undefined
        })
        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            L2_CROSS_DOMAIN_MESSENGER,
          ])
          if (relayedMessage) {
            return [
              SorareFactRegisteredRelayedMessage.create(input, {
                msgHash: relayedMessage.msgHash,
                ticketHash: factRegistered.ticketHash,
              }),
            ]
          }
        }
      }
    }
  }

  matchTypes = [SorareFactRegisteredRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (SorareFactRegisteredRelayedMessage.checkType(event)) {
      const srcEvent = db.find(SorareTransferRegisteredSentMessage, {
        msgHash: event.args.msgHash,
      })
      if (!srcEvent) return

      // Also find underlying OpStack events for the Message
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'base',
      })
      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage || !relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'sorare',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('sorare-base.L1ToL2Transfer', {
          srcEvent,
          srcAmount: srcEvent.args.amount,
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: srcEvent.args.amount, // Use L1 amount since L2 doesn't have it
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }
}
