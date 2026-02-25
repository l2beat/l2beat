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

const rootPropagatedLog = 'event RootPropagated(uint256 root)'

const WORLD_ID_BRIDGE = ChainSpecificAddress(
  'eth:0xa6d85f3b3be6ff6dc52c3aabe9a35d0ce252b79f',
)

const RootPropagated = createInteropEventType<object>('world-id.RootPropagated')

const parseRootPropagated = createEventParser(rootPropagatedLog)

export class WorldIdPlugin implements InteropPluginResyncable {
  readonly name = 'world-id'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: rootPropagatedLog,
        addresses: [WORLD_ID_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const rootPropagated = parseRootPropagated(input.log, [
        ChainSpecificAddress.address(WORLD_ID_BRIDGE),
      ])
      if (rootPropagated) {
        return [RootPropagated.create(input, {})]
      }
    }
  }

  matchTypes = [RelayedMessage, FailedRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (RelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // Find RootPropagated at exact offset from SentMessage
      // Pattern: SentMessage (N) → SentMessageExtension1 (N+1) → RootPropagated (N+2)
      const rootPropagated = db.find(RootPropagated, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!rootPropagated) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'world-id',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [rootPropagated],
        }),
      ]

      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('world-id.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: false,
            extraEvents: [rootPropagated],
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

      const rootPropagated = db.find(RootPropagated, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!rootPropagated) return

      return [
        Result.Message('opstack.L1ToL2MessageFailed', {
          app: 'world-id',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [rootPropagated],
        }),
      ]
    }
  }
}
