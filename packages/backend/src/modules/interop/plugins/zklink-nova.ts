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
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// zkLink Nova Arbitrator contract on Ethereum
const ZKLINK_ARBITRATOR = EthereumAddress(
  '0x1ee09a2caa0813a5183f90f5a6d0e4871f4c6002',
)

// Build lookup map from L1CrossDomainMessenger address to network
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// L1 event: MessageForwarded from zkLink Arbitrator + SentMessage combined
const ZklinkNovaSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('zklink-nova.SentMessage')

// Event parser for MessageForwarded from zkLink Nova Arbitrator
// event MessageForwarded(IL1Gateway indexed gateway, uint256 value, bytes callData)
const parseMessageForwarded = createEventParser(
  'event MessageForwarded(address indexed gateway, uint256 value, bytes callData)',
)

export class ZklinkNovaPlugin implements InteropPlugin {
  name = 'zklink-nova'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture MessageForwarded from zkLink Arbitrator
      const messageForwarded = parseMessageForwarded(input.log, [
        ZKLINK_ARBITRATOR,
      ])
      if (messageForwarded) {
        // The gateway in MessageForwarded is zkLink's L1Gateway wrapper
        // The gateway calls L1CrossDomainMessenger.sendMessage(), so sentMessage.sender = gateway
        const gatewayAddress = messageForwarded.gateway.toLowerCase()

        // Find SentMessage where sender matches the gateway
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(log.address)
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            network.l1CrossDomainMessenger,
          ])
          // Match by sender = gateway (the gateway called the CDM)
          if (
            !sentMessage ||
            sentMessage.sender.toLowerCase() !== gatewayAddress
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
            ZklinkNovaSentMessage.create(input, {
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
      // Check if there's a corresponding ZklinkNovaSentMessage
      const zklinkEvent = db.find(ZklinkNovaSentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!zklinkEvent) return

      // Also find underlying OpStack SentMessage
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'zklink-nova',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [zklinkEvent],
        }),
      ]

      // If ETH was sent via CrossDomainMessenger, also create a Transfer
      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('zklink-nova.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [zklinkEvent],
          }),
        )
      }

      return results
    }
  }
}
