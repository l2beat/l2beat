import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  parseRelayedMessage,
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

// Contract addresses - same address on both L1 and L2
const BEEFY_BRIDGE = EthereumAddress(
  '0xbbb8971aea2627fa2e1342bb5bf952ec521479f2',
)

// L1CrossDomainMessenger for Optimism
const L1_CROSS_DOMAIN_MESSENGER = EthereumAddress(
  '0x25ace71c97b33cc4729cf772ae268934f7ab5fa1',
)
// Standard L2CrossDomainMessenger for OP Stack chains
const L2_CROSS_DOMAIN_MESSENGER = EthereumAddress(
  '0x4200000000000000000000000000000000000007',
)

// Token addresses
const L1_BIFI_TOKEN = Address32.from(
  '0xbEEF8e0982874e0292E6C5751C5a4092b3e1bEEF',
)
const L2_BIFI_TOKEN = Address32.from(
  '0xc55e93c62874d8100dbd2dfe307edc1036ad5434',
)

// L1 event: BridgedOut + SentMessage combined
const BeefyBridgedOutSentMessage = createInteropEventType<{
  msgHash: string
  dstChainId: bigint
  bridgeUser: string
  tokenReceiver: string
  amount: bigint
}>('beefy-bridge.BridgedOutSentMessage')

// L2 event: BridgedIn + RelayedMessage combined
const BeefyBridgedInRelayedMessage = createInteropEventType<{
  msgHash: string
  srcChainId: bigint
  tokenReceiver: string
  amount: bigint
}>('beefy-bridge.BridgedInRelayedMessage')

// Event parsers
const parseBridgedOut = createEventParser(
  'event BridgedOut(uint256 indexed dstChainId, address indexed bridgeUser, address indexed tokenReceiver, uint256 amount)',
)

const parseBridgedIn = createEventParser(
  'event BridgedIn(uint256 indexed srcChainId, address indexed tokenReceiver, uint256 amount)',
)

export class BeefyBridgePlugin implements InteropPlugin {
  name = 'beefy-bridge'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture BridgedOut + SentMessage
      const bridgedOut = parseBridgedOut(input.log, [BEEFY_BRIDGE])
      if (bridgedOut) {
        // Find SentMessage in same tx
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [L1_CROSS_DOMAIN_MESSENGER])
          return parsed !== undefined
        })
        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            L1_CROSS_DOMAIN_MESSENGER,
          ])
          if (sentMessage) {
            // Find SentMessageExtension1
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === sentMessageLog.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [L1_CROSS_DOMAIN_MESSENGER])

            const msgHash = hashCrossDomainMessageV1(
              sentMessage.messageNonce,
              sentMessage.sender,
              sentMessage.target,
              extension?.value ?? 0n,
              sentMessage.gasLimit,
              sentMessage.message,
            )

            return [
              BeefyBridgedOutSentMessage.create(input, {
                msgHash,
                dstChainId: bridgedOut.dstChainId,
                bridgeUser: bridgedOut.bridgeUser,
                tokenReceiver: bridgedOut.tokenReceiver,
                amount: bridgedOut.amount,
              }),
            ]
          }
        }
      }
    } else if (input.chain === 'optimism') {
      // L2: Capture BridgedIn + RelayedMessage
      const bridgedIn = parseBridgedIn(input.log, [BEEFY_BRIDGE])
      if (bridgedIn) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [L2_CROSS_DOMAIN_MESSENGER])
          return parsed !== undefined
        })
        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            L2_CROSS_DOMAIN_MESSENGER,
          ])
          if (relayedMessage) {
            return [
              BeefyBridgedInRelayedMessage.create(input, {
                msgHash: relayedMessage.msgHash,
                srcChainId: bridgedIn.srcChainId,
                tokenReceiver: bridgedIn.tokenReceiver,
                amount: bridgedIn.amount,
              }),
            ]
          }
        }
      }
    }
  }

  matchTypes = [BeefyBridgedInRelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (BeefyBridgedInRelayedMessage.checkType(event)) {
      const srcEvent = db.find(BeefyBridgedOutSentMessage, {
        msgHash: event.args.msgHash,
      })
      if (!srcEvent) return

      // Also find underlying OpStack events for the Message
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'optimism',
      })
      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: 'optimism',
      })
      if (!sentMessage || !relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'beefy',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('beefy-bridge.L1ToL2Transfer', {
          srcEvent,
          srcAmount: srcEvent.args.amount,
          srcTokenAddress: L1_BIFI_TOKEN,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L2_BIFI_TOKEN,
        }),
      ]
    }
  }
}
