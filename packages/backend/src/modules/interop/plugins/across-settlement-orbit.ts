import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  parseMessageDelivered,
  RedeemScheduled,
} from './orbitstack/orbitstack'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// == Event signatures ==

const messageRelayedLog = 'event MessageRelayed(address target, bytes message)'
const messageDeliveredLog =
  'event MessageDelivered(uint256 indexed messageIndex, bytes32 indexed beforeInboxAcc, address inbox, uint8 kind, address sender, bytes32 messageDataHash, uint256 baseFeeL1, uint64 timestamp)'

// Across HubPool address on Ethereum
const HUB_POOL = ChainSpecificAddress(
  'eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda',
)

// Build lookup map from bridge address to network (OrbitStack)
const ORBIT_BRIDGE_TO_NETWORK = new Map(
  ORBITSTACK_NETWORKS.map((n) => [
    ChainSpecificAddress.address(n.bridge).toString(),
    n,
  ]),
)

// L1 event: MessageRelayed from Across HubPool
const MessageRelayed = createInteropEventType<{
  chain: string
}>('across-settlement.MessageRelayed')

// Event parser for MessageRelayed from HubPool
const parseMessageRelayed = createEventParser(messageRelayedLog)

export class AcrossSettlementOrbitPlugin implements InteropPluginResyncable {
  readonly name = 'across-settlement-orbit'

  getDataRequests(): DataRequest[] {
    return [
      // L1: MessageRelayed from Across HubPool (with MessageDelivered to identify OrbitStack)
      {
        type: 'event',
        signature: messageRelayedLog,
        includeTxEvents: [messageDeliveredLog],
        addresses: [HUB_POOL],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture MessageRelayed from HubPool
      const messageRelayed = parseMessageRelayed(input.log, [
        ChainSpecificAddress.address(HUB_POOL),
      ])
      if (messageRelayed) {
        const currentLogIndex = input.log.logIndex ?? -1

        // The bridge event (MessageDelivered) is always at logIndex - 2
        // Pattern: MessageDelivered (N-2) → InboxMessageDelivered (N-1) → MessageRelayed (N)
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
            MessageRelayed.create(input, {
              chain: orbitNetwork.chain,
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
      // Find underlying OrbitStack MessageDelivered by messageNum
      const messageDelivered = db.find(MessageDelivered, {
        messageNum: event.args.messageNum,
        chain: event.args.chain,
      })
      if (!messageDelivered) return

      // L1: MessageDelivered (N) → InboxMessageDelivered (N+1) → MessageRelayed (N+2)
      const acrossEvent = db.find(MessageRelayed, {
        sameTxAtOffset: { event: messageDelivered, offset: 2 },
        chain: event.args.chain,
      })
      if (!acrossEvent) return

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
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: event.args.ethAmount,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: false,
            extraEvents: [acrossEvent],
          }),
        )
      }

      return results
    }
  }
}
