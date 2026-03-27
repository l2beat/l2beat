import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  OPSTACK_NETWORKS,
  PortalDepositFinalized,
  parseSentMessage,
  TransactionDeposited,
} from './opstack/opstack'
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

// Across HubPool address on Ethereum
const HUB_POOL = ChainSpecificAddress(
  'eth:0xc186fA914353c44b2E33eBE05f21846F1048bEda',
)

const MessageRelayedOP = createInteropEventType<object>(
  'across-settlement.MessageRelayedOP',
)

const sentMessageLog =
  'event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)'

const parseMessageRelayed = createEventParser(messageRelayedLog)

const L1_CROSS_DOMAIN_MESSENGERS = OPSTACK_NETWORKS.map((n) =>
  ChainSpecificAddress.address(n.l1CrossDomainMessenger),
)

export class AcrossSettlementOpPlugin implements InteropPluginResyncable {
  readonly name = 'across-settlement-op'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageRelayedLog,
        includeTxEvents: [sentMessageLog],
        addresses: [HUB_POOL],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const messageRelayed = parseMessageRelayed(input.log, [
        ChainSpecificAddress.address(HUB_POOL),
      ])
      if (messageRelayed) {
        // Only capture if there's an OpStack SentMessage at offset -2
        // Pattern: SentMessage (N) → SentMessageExtension1 (N+1) → MessageRelayed (N+2)
        const currentLogIndex = input.log.logIndex ?? -1
        const prevLog = input.txLogs.find(
          (log) => log.logIndex === currentLogIndex - 2,
        )
        if (!prevLog) return
        if (!parseSentMessage(prevLog, L1_CROSS_DOMAIN_MESSENGERS)) return

        return [MessageRelayedOP.create(input, {})]
      }
    }
  }

  matchTypes = [PortalDepositFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (PortalDepositFinalized.checkType(event)) {
      const transactionDeposited = db.find(TransactionDeposited, {
        sourceHash: event.args.sourceHash,
        chain: event.args.chain,
      })
      if (!transactionDeposited) return

      // Find MessageRelayedOP at exact offset from TransactionDeposited
      // Pattern: TransactionDeposited (N) → SentMessage (N+1) → SentMessageExtension1 (N+2) → MessageRelayed (N+3)
      const messageRelayed = db.find(MessageRelayedOP, {
        sameTxAtOffset: { event: transactionDeposited, offset: 3 },
      })
      if (!messageRelayed) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'across-settlement',
          srcEvent: transactionDeposited,
          dstEvent: event,
          extraEvents: [messageRelayed],
        }),
      ]

      if (transactionDeposited.args.mint > 0n) {
        results.push(
          Result.Transfer('across-settlement.L1ToL2Transfer', {
            srcEvent: transactionDeposited,
            srcAmount: transactionDeposited.args.mint,
            srcTokenAddress: Address32.NATIVE,
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: transactionDeposited.args.mint,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: false,
            extraEvents: [messageRelayed],
          }),
        )
      }

      return results
    }
  }
}
