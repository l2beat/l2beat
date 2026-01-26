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

// Contract addresses - same address on both L1 and L2
const L1_BEEFY_BRIDGE = ChainSpecificAddress(
  'eth:0xbbb8971aea2627fa2e1342bb5bf952ec521479f2',
)
const L2_BEEFY_BRIDGE = ChainSpecificAddress(
  'oeth:0xbbb8971aea2627fa2e1342bb5bf952ec521479f2',
)

// Token addresses
const L1_BIFI_TOKEN = Address32.from(
  '0xbEEF8e0982874e0292E6C5751C5a4092b3e1bEEF',
)
const L2_BIFI_TOKEN = Address32.from(
  '0xc55e93c62874d8100dbd2dfe307edc1036ad5434',
)

// Event signatures
const bridgedOutLog =
  'event BridgedOut(uint256 indexed dstChainId, address indexed bridgeUser, address indexed tokenReceiver, uint256 amount)'
const bridgedInLog =
  'event BridgedIn(uint256 indexed srcChainId, address indexed tokenReceiver, uint256 amount)'

// L1: BridgedOut from Beefy bridge
const BridgedOut = createInteropEventType<{
  dstChainId: bigint
  bridgeUser: string
  tokenReceiver: string
  amount: bigint
}>('beefy-bridge.BridgedOut')

// L2: BridgedIn from Beefy bridge
const BridgedIn = createInteropEventType<{
  srcChainId: bigint
  tokenReceiver: string
  amount: bigint
}>('beefy-bridge.BridgedIn')

// Event parsers
const parseBridgedOut = createEventParser(bridgedOutLog)
const parseBridgedIn = createEventParser(bridgedInLog)

export class BeefyBridgePlugin implements InteropPluginResyncable {
  readonly name = 'beefy-bridge'

  getDataRequests(): DataRequest[] {
    return [
      // L1: BridgedOut from L1_BEEFY_BRIDGE
      {
        type: 'event',
        signature: bridgedOutLog,
        addresses: [L1_BEEFY_BRIDGE],
      },
      // L2: BridgedIn from L2_BEEFY_BRIDGE
      {
        type: 'event',
        signature: bridgedInLog,
        addresses: [L2_BEEFY_BRIDGE],
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture BridgedOut
      const bridgedOut = parseBridgedOut(input.log, [
        ChainSpecificAddress.address(L1_BEEFY_BRIDGE),
      ])
      if (bridgedOut) {
        return [
          BridgedOut.create(input, {
            dstChainId: bridgedOut.dstChainId,
            bridgeUser: bridgedOut.bridgeUser,
            tokenReceiver: bridgedOut.tokenReceiver,
            amount: bridgedOut.amount,
          }),
        ]
      }
    } else if (input.chain === 'optimism') {
      // L2: Capture BridgedIn
      const bridgedIn = parseBridgedIn(input.log, [
        ChainSpecificAddress.address(L2_BEEFY_BRIDGE),
      ])
      if (bridgedIn) {
        return [
          BridgedIn.create(input, {
            srcChainId: bridgedIn.srcChainId,
            tokenReceiver: bridgedIn.tokenReceiver,
            amount: bridgedIn.amount,
          }),
        ]
      }
    }
  }

  matchTypes = [BridgedIn, FailedRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (BridgedIn.checkType(event)) {
      // L2: BridgedIn → RelayedMessage (offset +1)
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 1 },
        chain: 'optimism',
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: 'optimism',
      })
      if (!sentMessage) return

      // L1: SentMessage (N) → SentMessageExtension1 (N+1) → BridgedOut (N+2)
      const bridgedOut = db.find(BridgedOut, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!bridgedOut) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'beefy-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [bridgedOut, event],
        }),
        Result.Transfer('beefy-bridge.L1ToL2Transfer', {
          srcEvent: bridgedOut,
          srcAmount: bridgedOut.args.amount,
          srcTokenAddress: L1_BIFI_TOKEN,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L2_BIFI_TOKEN,
        }),
      ]
    }

    if (FailedRelayedMessage.checkType(event)) {
      if (event.args.chain !== 'optimism') return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'optimism',
      })
      if (!sentMessage) return

      const bridgedOut = db.find(BridgedOut, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
      })
      if (!bridgedOut) return

      return [
        Result.Message('opstack.L1ToL2MessageFailed', {
          app: 'beefy-bridge',
          srcEvent: sentMessage,
          dstEvent: event,
          extraEvents: [bridgedOut],
        }),
      ]
    }
  }
}
