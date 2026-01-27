import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import {
  FailedRelayedMessage,
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

const MessageRelayedOP = createInteropEventType<object>(
  'across-settlement.MessageRelayedOP',
)

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
        return [MessageRelayedOP.create(input, {})]
      }
    }
  }

  matchTypes = [RelayedMessage, FailedRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (RelayedMessage.checkType(event)) {
      // Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // Find MessageRelayedOP at exact offset from SentMessage
      // Pattern: SentMessage (N) → SentMessageExtension1 (N+1) → MessageRelayed (N+2)
      const messageRelayed = db.find(MessageRelayedOP, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
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

    if (FailedRelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const messageRelayed = db.find(MessageRelayedOP, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!messageRelayed) return

      return [
        Result.Message('opstack.L1ToL2MessageFailed', {
          app: 'across-settlement',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [messageRelayed],
        }),
      ]
    }
  }
}
