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

// World ID OpWorldID contract on Ethereum
const WORLD_ID_BRIDGE = EthereumAddress(
  '0xa6d85f3b3be6ff6dc52c3aabe9a35d0ce252b79f',
)

// Build lookup map from L1CrossDomainMessenger address to network
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// L1 event: RootPropagated from World ID + SentMessage combined
const WorldIdSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('world-id.SentMessage')

// Event parser for RootPropagated from World ID
// event RootPropagated(uint256 root)
const parseRootPropagated = createEventParser(
  'event RootPropagated(uint256 root)',
)

export class WorldIdPlugin implements InteropPlugin {
  readonly name = 'world-id'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture RootPropagated from World ID contract
      const rootPropagated = parseRootPropagated(input.log, [WORLD_ID_BRIDGE])
      if (rootPropagated) {
        // Find SentMessage from any known L1CrossDomainMessenger in the same tx
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(log.address)
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            network.l1CrossDomainMessenger,
          ])
          if (!sentMessage) continue

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
            WorldIdSentMessage.create(input, {
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
      // Check if there's a corresponding WorldIdSentMessage
      const worldIdEvent = db.find(WorldIdSentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!worldIdEvent) return

      // Also find underlying OpStack SentMessage
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'world-id',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [worldIdEvent],
        }),
      ]

      // If ETH was sent via CrossDomainMessenger, also create a Transfer
      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('world-id.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [worldIdEvent],
          }),
        )
      }

      return results
    }
  }
}
