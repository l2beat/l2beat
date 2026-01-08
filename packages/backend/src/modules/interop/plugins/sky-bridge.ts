import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  MessagePassed,
  OPSTACK_NETWORKS,
  parseRelayedMessage,
  parseSentMessage,
  parseSentMessageExtension1,
  parseWithdrawalFinalized,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
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

// Sky bridge addresses (Base only)
// Supports USDS token
const L1_SKY_BRIDGE = EthereumAddress(
  '0xa5874756416fa632257eea380cabd2e87ced352a',
)
const L2_SKY_BRIDGE = EthereumAddress(
  '0xee44cdb68d618d58f75d9fe0818b640bd7b8a7b7',
)

// OpStack network config for Base
// biome-ignore lint/style/noNonNullAssertion: Base is always in OPSTACK_NETWORKS
const BASE_NETWORK = OPSTACK_NETWORKS.find((n) => n.chain === 'base')!

// L1 → L2: ERC20BridgeInitiated from Sky bridge + SentMessage combined
const SkyDepositSentMessage = createInteropEventType<{
  msgHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.DepositSentMessage')

// L2 relay of L1→L2 deposit: ERC20BridgeFinalized from Sky bridge + RelayedMessage combined
const SkyDepositFinalized = createInteropEventType<{
  msgHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.DepositFinalized')

// L2 → L1: ERC20BridgeInitiated from Sky bridge + MessagePassed combined
const SkyWithdrawalMessagePassed = createInteropEventType<{
  withdrawalHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.WithdrawalMessagePassed', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20BridgeFinalized from Sky bridge + WithdrawalFinalized combined
const SkyWithdrawalFinalized = createInteropEventType<{
  withdrawalHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('sky-bridge.WithdrawalFinalized')

// Event parsers - using the newer OpStack bridge event signatures
// Note: on L1 localToken=L1, remoteToken=L2; on L2 localToken=L2, remoteToken=L1
const parseERC20BridgeInitiated = createEventParser(
  'event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

const parseERC20BridgeFinalized = createEventParser(
  'event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

// MessagePassed event parser (from L2ToL1MessagePasser)
const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

export class SkyBridgePlugin implements InteropPlugin {
  name = 'sky-bridge'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture ERC20BridgeInitiated (L1 → L2 deposit)
      const bridgeInitiated = parseERC20BridgeInitiated(input.log, [
        L1_SKY_BRIDGE,
      ])
      if (bridgeInitiated) {
        // Find SentMessage from Base L1CrossDomainMessenger in the same tx
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [
            BASE_NETWORK.l1CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            BASE_NETWORK.l1CrossDomainMessenger,
          ])
          if (sentMessage) {
            // Find SentMessageExtension1
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === sentMessageLog.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [
                BASE_NETWORK.l1CrossDomainMessenger,
              ])

            const msgHash = hashCrossDomainMessageV1(
              sentMessage.messageNonce,
              sentMessage.sender,
              sentMessage.target,
              extension?.value ?? 0n,
              sentMessage.gasLimit,
              sentMessage.message,
            )

            // On L1: localToken = L1 token, remoteToken = L2 token
            return [
              SkyDepositSentMessage.create(input, {
                msgHash,
                amount: bridgeInitiated.amount,
                l1Token: Address32.from(
                  EthereumAddress(bridgeInitiated.localToken),
                ),
                l2Token: Address32.from(
                  EthereumAddress(bridgeInitiated.remoteToken),
                ),
              }),
            ]
          }
        }
      }

      // L1: Capture ERC20BridgeFinalized (L2 → L1 withdrawal finalization)
      const bridgeFinalized = parseERC20BridgeFinalized(input.log, [
        L1_SKY_BRIDGE,
      ])
      if (bridgeFinalized) {
        // Find WithdrawalFinalized event from OptimismPortal in same tx
        const withdrawalFinalizedLog = input.txLogs.find((log) => {
          const parsed = parseWithdrawalFinalized(log, [
            BASE_NETWORK.optimismPortal,
          ])
          return parsed !== undefined
        })

        if (withdrawalFinalizedLog) {
          const portalWithdrawalFinalized = parseWithdrawalFinalized(
            withdrawalFinalizedLog,
            [BASE_NETWORK.optimismPortal],
          )
          if (portalWithdrawalFinalized) {
            // On L1: localToken = L1 token, remoteToken = L2 token
            return [
              SkyWithdrawalFinalized.create(input, {
                withdrawalHash: portalWithdrawalFinalized.withdrawalHash,
                amount: bridgeFinalized.amount,
                l1Token: Address32.from(
                  EthereumAddress(bridgeFinalized.localToken),
                ),
                l2Token: Address32.from(
                  EthereumAddress(bridgeFinalized.remoteToken),
                ),
              }),
            ]
          }
        }
      }
    } else if (input.chain === 'base') {
      // L2: Capture ERC20BridgeFinalized (L1 → L2 deposit relay)
      const bridgeFinalized = parseERC20BridgeFinalized(input.log, [
        L2_SKY_BRIDGE,
      ])
      if (bridgeFinalized) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            BASE_NETWORK.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            BASE_NETWORK.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            // On L2: localToken = L2 token, remoteToken = L1 token
            return [
              SkyDepositFinalized.create(input, {
                msgHash: relayedMessage.msgHash,
                amount: bridgeFinalized.amount,
                l1Token: Address32.from(
                  EthereumAddress(bridgeFinalized.remoteToken),
                ),
                l2Token: Address32.from(
                  EthereumAddress(bridgeFinalized.localToken),
                ),
              }),
            ]
          }
        }
      }

      // L2: Capture ERC20BridgeInitiated (L2 → L1 withdrawal)
      const bridgeInitiated = parseERC20BridgeInitiated(input.log, [
        L2_SKY_BRIDGE,
      ])
      if (bridgeInitiated) {
        // Find MessagePassed in same tx
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [
            BASE_NETWORK.l2ToL1MessagePasser,
          ])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            BASE_NETWORK.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            // On L2: localToken = L2 token, remoteToken = L1 token
            return [
              SkyWithdrawalMessagePassed.create(input, {
                withdrawalHash: messagePassed.withdrawalHash,
                amount: bridgeInitiated.amount,
                l1Token: Address32.from(
                  EthereumAddress(bridgeInitiated.remoteToken),
                ),
                l2Token: Address32.from(
                  EthereumAddress(bridgeInitiated.localToken),
                ),
              }),
            ]
          }
        }
      }
    }
  }

  // Match on our combined events
  matchTypes = [SkyDepositFinalized, SkyWithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (SkyDepositFinalized.checkType(event)) {
      const depositSentMessage = db.find(SkyDepositSentMessage, {
        msgHash: event.args.msgHash,
      })
      if (!depositSentMessage) return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'base',
      })
      if (!sentMessage) return

      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: 'base',
      })
      if (!relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'sky-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('sky-bridge.L1ToL2Transfer', {
          srcEvent: depositSentMessage,
          srcAmount: depositSentMessage.args.amount,
          srcTokenAddress: depositSentMessage.args.l1Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (SkyWithdrawalFinalized.checkType(event)) {
      const withdrawalMessagePassed = db.find(SkyWithdrawalMessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
      })
      if (!withdrawalMessagePassed) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: 'base',
      })
      if (!messagePassed) return

      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        withdrawalHash: event.args.withdrawalHash,
        chain: 'base',
      })
      if (!withdrawalFinalized) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'sky-bridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
        }),
        Result.Transfer('sky-bridge.L2ToL1Transfer', {
          srcEvent: withdrawalMessagePassed,
          srcAmount: withdrawalMessagePassed.args.amount,
          srcTokenAddress: withdrawalMessagePassed.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }
  }
}
