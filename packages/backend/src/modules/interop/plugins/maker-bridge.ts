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

// Maker bridge addresses (Optimism only)
// Supports DAI, USDS, and sUSDS tokens
const L1_MAKER_BRIDGE = EthereumAddress(
  '0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
)
const L2_MAKER_BRIDGE = EthereumAddress(
  '0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
)

// OpStack network config for Optimism
// biome-ignore lint/style/noNonNullAssertion: Optimism is always in OPSTACK_NETWORKS
const OPTIMISM_NETWORK = OPSTACK_NETWORKS.find((n) => n.chain === 'optimism')!

// L1 → L2: ERC20DepositInitiated from Maker bridge + SentMessage combined
const MakerDepositSentMessage = createInteropEventType<{
  msgHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.DepositSentMessage')

// L2 relay of L1→L2 deposit: DepositFinalized from Maker bridge + RelayedMessage combined
const MakerDepositFinalized = createInteropEventType<{
  msgHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.DepositFinalized')

// L2 → L1: WithdrawalInitiated from Maker bridge + MessagePassed combined
const MakerWithdrawalMessagePassed = createInteropEventType<{
  withdrawalHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.WithdrawalMessagePassed', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20WithdrawalFinalized from Maker bridge + WithdrawalFinalized combined
const MakerWithdrawalFinalized = createInteropEventType<{
  withdrawalHash: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.WithdrawalFinalized')

// Event parsers
const parseERC20DepositInitiated = createEventParser(
  'event ERC20DepositInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseERC20WithdrawalFinalized = createEventParser(
  'event ERC20WithdrawalFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

// MessagePassed event parser (from L2ToL1MessagePasser)
const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

export class MakerBridgePlugin implements InteropPlugin {
  name = 'maker-bridge'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture ERC20DepositInitiated (L1 → L2 deposit)
      const depositInitiated = parseERC20DepositInitiated(input.log, [
        L1_MAKER_BRIDGE,
      ])
      if (depositInitiated) {
        // Find SentMessage from Optimism L1CrossDomainMessenger in the same tx
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [
            OPTIMISM_NETWORK.l1CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            OPTIMISM_NETWORK.l1CrossDomainMessenger,
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
                OPTIMISM_NETWORK.l1CrossDomainMessenger,
              ])

            const msgHash = hashCrossDomainMessageV1(
              sentMessage.messageNonce,
              sentMessage.sender,
              sentMessage.target,
              extension?.value ?? 0n,
              sentMessage.gasLimit,
              sentMessage.message,
            )

            return [
              MakerDepositSentMessage.create(input, {
                msgHash,
                amount: depositInitiated._amount,
                l1Token: Address32.from(
                  EthereumAddress(depositInitiated._l1Token),
                ),
                l2Token: Address32.from(
                  EthereumAddress(depositInitiated._l2Token),
                ),
              }),
            ]
          }
        }
      }

      // L1: Capture ERC20WithdrawalFinalized (L2 → L1 withdrawal finalization)
      const withdrawalFinalized = parseERC20WithdrawalFinalized(input.log, [
        L1_MAKER_BRIDGE,
      ])
      if (withdrawalFinalized) {
        // Find WithdrawalFinalized event from OptimismPortal in same tx
        const withdrawalFinalizedLog = input.txLogs.find((log) => {
          const parsed = parseWithdrawalFinalized(log, [
            OPTIMISM_NETWORK.optimismPortal,
          ])
          return parsed !== undefined
        })

        if (withdrawalFinalizedLog) {
          const portalWithdrawalFinalized = parseWithdrawalFinalized(
            withdrawalFinalizedLog,
            [OPTIMISM_NETWORK.optimismPortal],
          )
          if (portalWithdrawalFinalized) {
            return [
              MakerWithdrawalFinalized.create(input, {
                withdrawalHash: portalWithdrawalFinalized.withdrawalHash,
                amount: withdrawalFinalized._amount,
                l1Token: Address32.from(
                  EthereumAddress(withdrawalFinalized._l1Token),
                ),
                l2Token: Address32.from(
                  EthereumAddress(withdrawalFinalized._l2Token),
                ),
              }),
            ]
          }
        }
      }
    } else if (input.chain === 'optimism') {
      // L2: Capture DepositFinalized (L1 → L2 deposit relay)
      const depositFinalized = parseDepositFinalized(input.log, [
        L2_MAKER_BRIDGE,
      ])
      if (depositFinalized) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            OPTIMISM_NETWORK.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            OPTIMISM_NETWORK.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            return [
              MakerDepositFinalized.create(input, {
                msgHash: relayedMessage.msgHash,
                amount: depositFinalized._amount,
                l1Token: Address32.from(
                  EthereumAddress(depositFinalized._l1Token),
                ),
                l2Token: Address32.from(
                  EthereumAddress(depositFinalized._l2Token),
                ),
              }),
            ]
          }
        }
      }

      // L2: Capture WithdrawalInitiated (L2 → L1 withdrawal)
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        L2_MAKER_BRIDGE,
      ])
      if (withdrawalInitiated) {
        // Find MessagePassed in same tx
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [
            OPTIMISM_NETWORK.l2ToL1MessagePasser,
          ])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            OPTIMISM_NETWORK.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            return [
              MakerWithdrawalMessagePassed.create(input, {
                withdrawalHash: messagePassed.withdrawalHash,
                amount: withdrawalInitiated._amount,
                l1Token: Address32.from(
                  EthereumAddress(withdrawalInitiated._l1Token),
                ),
                l2Token: Address32.from(
                  EthereumAddress(withdrawalInitiated._l2Token),
                ),
              }),
            ]
          }
        }
      }
    }
  }

  // Match on our combined events
  matchTypes = [MakerDepositFinalized, MakerWithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (MakerDepositFinalized.checkType(event)) {
      const depositSentMessage = db.find(MakerDepositSentMessage, {
        msgHash: event.args.msgHash,
      })
      if (!depositSentMessage) return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: 'optimism',
      })
      if (!sentMessage) return

      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: 'optimism',
      })
      if (!relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'maker-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('maker-bridge.L1ToL2Transfer', {
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
    if (MakerWithdrawalFinalized.checkType(event)) {
      const withdrawalMessagePassed = db.find(MakerWithdrawalMessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
      })
      if (!withdrawalMessagePassed) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: 'optimism',
      })
      if (!messagePassed) return

      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        withdrawalHash: event.args.withdrawalHash,
        chain: 'optimism',
      })
      if (!withdrawalFinalized) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'maker-bridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
        }),
        Result.Transfer('maker-bridge.L2ToL1Transfer', {
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
