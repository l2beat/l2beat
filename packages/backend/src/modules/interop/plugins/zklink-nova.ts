import { Address32, ChainSpecificAddress } from '@l2beat/shared-pure'
import { RelayedMessage, SentMessage } from './opstack/opstack'
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

const messageForwardedLog =
  'event MessageForwarded(address indexed gateway, uint256 value, bytes callData)'

const ZKLINK_ARBITRATOR = ChainSpecificAddress(
  'eth:0x1ee09a2caa0813a5183f90f5a6d0e4871f4c6002',
)

const MessageForwarded = createInteropEventType<object>(
  'zklink-nova.MessageForwarded',
)

const parseMessageForwarded = createEventParser(messageForwardedLog)

export class ZklinkNovaPlugin implements InteropPluginResyncable {
  readonly name = 'zklink-nova'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messageForwardedLog,
        addresses: [ZKLINK_ARBITRATOR],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const messageForwarded = parseMessageForwarded(input.log, [
        ChainSpecificAddress.address(ZKLINK_ARBITRATOR),
      ])
      if (messageForwarded) {
        return [MessageForwarded.create(input, {})]
      }
    }
  }

  matchTypes = [RelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (RelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // Find MessageForwarded at exact offset from SentMessage
      // Pattern: SentMessage (N) → SentMessageExtension1 (N+1) → MessageForwarded (N+2)
      const messageForwarded = db.find(MessageForwarded, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!messageForwarded) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'zklink-nova',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [messageForwarded],
        }),
      ]

      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('zklink-nova.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            extraEvents: [messageForwarded],
          }),
        )
      }

      return results
    }
  }
}
