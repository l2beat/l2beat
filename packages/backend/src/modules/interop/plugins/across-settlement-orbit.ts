import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
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

// Build lookup map from bridge address to network (OrbitStack)
const ORBIT_BRIDGE_TO_NETWORK = new Map(
  ORBITSTACK_NETWORKS.map((n) => [n.bridge.toString(), n]),
)

// L1 event: MessageRelayed from HubPool + MessageDelivered combined (OrbitStack)
// Keep msgHash for OrbitStack as it needs messageNum for matching
const AcrossSettlementRelayedMessageOrbit = createInteropEventType<{
  chain: string
  messageNum: string
}>('across-settlement.RelayedMessageOrbit')

// Event parser for MessageRelayed from HubPool
const parseMessageRelayed = createEventParser(
  'event MessageRelayed(address target, bytes message)',
)

export class AcrossSettlementOrbitPlugin implements InteropPlugin {
  readonly name = 'across-settlement-orbit'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture MessageRelayed from HubPool
      const messageRelayed = parseMessageRelayed(input.log, [HUB_POOL])
      if (messageRelayed) {
        const currentLogIndex = input.log.logIndex ?? -1

        // The bridge event (MessageDelivered) is always at logIndex - 2
        // Pattern: MessageDelivered (N-2) -> InboxMessageDelivered (N-1) -> MessageRelayed (N)
        const bridgeLog = input.txLogs.find(
          (log) => log.logIndex === currentLogIndex - 2,
        )
        if (!bridgeLog) return

        // Check if bridgeLog is a MessageDelivered from a known Arbitrum bridge
        const orbitNetwork = ORBIT_BRIDGE_TO_NETWORK.get(bridgeLog.address)
        if (orbitNetwork) {
          const messageDelivered = parseMessageDelivered(bridgeLog, [
            ChainSpecificAddress.address(orbitNetwork.bridge),
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
    // No L2 event capture - we match on orbitstack's RedeemScheduled
  }

  // Match on orbitstack's RedeemScheduled
  matchTypes = [RedeemScheduled]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
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
