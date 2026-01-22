import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import {
  OPSTACK_NETWORKS,
  parseSentMessage,
  RelayedMessage,
  SentMessage,
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

// Build lookup map from L1CrossDomainMessenger address to network (OpStack)
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [
    ChainSpecificAddress.address(n.l1CrossDomainMessenger).toString(),
    n,
  ]),
)

// L1 event: MessageRelayed from HubPool (OpStack)
const MessageRelayedOP = createInteropEventType<{
  chain: string
}>('across-settlement.MessageRelayedOP')

// Event parser for MessageRelayed from HubPool
const parseMessageRelayed = createEventParser(messageRelayedLog)

export class AcrossSettlementOpPlugin implements InteropPluginResyncable {
  readonly name = 'across-settlement-op'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageRelayedLog,
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
        const targetAddress = messageRelayed.target.toLowerCase()
        // Find SentMessage where target matches to determine chain
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(
            EthereumAddress(log.address).toString(),
          )
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            ChainSpecificAddress.address(network.l1CrossDomainMessenger),
          ])
          if (sentMessage?.target.toLowerCase() === targetAddress) {
            return [MessageRelayedOP.create(input, { chain: network.chain })]
          }
        }
      }
    }
  }

  matchTypes = [RelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (RelayedMessage.checkType(event)) {
      // Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // Find MessageRelayedOP that comes after SentMessage in the same tx
      const messageRelayed = db.find(MessageRelayedOP, {
        sameTxAfter: sentMessage,
        chain: event.args.chain,
      })
      if (!messageRelayed) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'across-settlement',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [messageRelayed],
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
            extraEvents: [messageRelayed],
          }),
        )
      }

      return results
    }
  }
}
