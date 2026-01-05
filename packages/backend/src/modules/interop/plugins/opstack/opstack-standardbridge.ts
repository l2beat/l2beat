import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import {
  hashCrossDomainMessageV1,
  MessagePassed,
  OPSTACK_NETWORKS,
  parseMessagePassed,
  parseRelayedMessage,
  parseSentMessage,
  parseSentMessageExtension1,
  parseWithdrawalFinalized,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
} from './opstack'

// L2 -> L1 withdrawal initiated
const ERC20BridgeInitiatedMessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.MessagePassedERC20BridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// NOTE: we rename local/remote tokens to l2/l1 for clarity. This implies that if the same event is to be used for L1->L2 deposits,
// the naming should be reverted.
const parseERC20BridgeInitiated = createEventParser(
  'event ERC20BridgeInitiated(address indexed l2Token, address indexed l1Token, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L1 finalization of L2->L1 withdrawal
const ERC20BridgeFinalizedWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.WithdrawalFinalizedERC20BridgeFinalized')

const parseERC20BridgeFinalized = createEventParser(
  'event ERC20BridgeFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L1 -> L2 deposit initiated
const ERC20DepositInitiatedSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.SentMessageERC20DepositInitiated')

// NOTE: this is a "deprecated" event but still used. It is not used on the L2. The proper way would be to use the "ERC20BridgeInitiated" event,
// but it has the same sig as the L2->L1 event. We use this for now for simplicity.
const parseERC20DepositInitiated = createEventParser(
  'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L2 relay of L1->L2 deposit
const DepositFinalizedRelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.RelayedMessageDepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)',
)

// ETH Bridge events
const ETHBridgeInitiatedSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
}>('opstack.SentMessageETHBridgeInitiated')

const parseETHBridgeInitiated = createEventParser(
  'event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)',
)

const ETHBridgeFinalizedRelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
}>('opstack.RelayedMessageETHBridgeFinalized')

const parseETHBridgeFinalized = createEventParser(
  'event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)',
)

// L2 -> L1 ETH withdrawal initiated
const ETHBridgeInitiatedMessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
}>('opstack.MessagePassedETHBridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization of L2->L1 ETH withdrawal
const ETHBridgeFinalizedWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
}>('opstack.WithdrawalFinalizedETHBridgeFinalized')

export class OpStackStandardBridgePlugin implements InteropPlugin {
  name = 'opstack-standardbridge'

  constructor(readonly cluster: string) {}

  capture(input: LogToCapture) {
    if (input.chain !== 'ethereum') {
      // L2 -> L1 ERC20 withdrawal initiated
      const network = OPSTACK_NETWORKS.find((x) => x.chain === input.chain)
      if (!network) return
      const erc20BridgeInitiated = parseERC20BridgeInitiated(input.log, [
        network.l2StandardBridge,
      ])
      if (erc20BridgeInitiated) {
        // Find the MessagePassed event in the same transaction
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [network.l2ToL1MessagePasser])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            network.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            return [
              ERC20BridgeInitiatedMessagePassed.create(input, {
                chain: network.chain,
                withdrawalHash: messagePassed.withdrawalHash,
                l1Token: Address32.from(erc20BridgeInitiated.l1Token),
                l2Token: Address32.from(erc20BridgeInitiated.l2Token),
                amount: erc20BridgeInitiated.amount,
              }),
            ]
          }
        }
      }

      // L2 -> L1 ETH withdrawal initiated
      const ethBridgeInitiatedL2 = parseETHBridgeInitiated(input.log, [
        network.l2StandardBridge,
      ])
      if (ethBridgeInitiatedL2) {
        // Find the MessagePassed event in the same transaction
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [network.l2ToL1MessagePasser])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            network.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            return [
              ETHBridgeInitiatedMessagePassed.create(input, {
                chain: network.chain,
                withdrawalHash: messagePassed.withdrawalHash,
                amount: ethBridgeInitiatedL2.amount,
              }),
            ]
          }
        }
      }

      // L2 relay of L1->L2 ERC20 deposit
      const depositFinalized = parseDepositFinalized(input.log, [
        network.l2StandardBridge,
      ])
      if (depositFinalized) {
        // Find the RelayedMessage event in the same transaction
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            network.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            network.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            return [
              DepositFinalizedRelayedMessage.create(input, {
                chain: network.chain,
                msgHash: relayedMessage.msgHash,
                l1Token: Address32.from(depositFinalized.l1Token),
                l2Token: Address32.from(depositFinalized.l2Token),
                amount: depositFinalized.amount,
              }),
            ]
          }
        }
      }

      // L2 relay of L1->L2 ETH deposit
      const ethBridgeFinalized = parseETHBridgeFinalized(input.log, [
        network.l2StandardBridge,
      ])
      if (ethBridgeFinalized) {
        // Find the RelayedMessage event in the same transaction
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            network.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            network.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            return [
              ETHBridgeFinalizedRelayedMessage.create(input, {
                chain: network.chain,
                msgHash: relayedMessage.msgHash,
                amount: ethBridgeFinalized.amount,
              }),
            ]
          }
        }
      }
    } else {
      // L1 side - find which network this belongs to by matching the log address
      const logAddress = EthereumAddress(input.log.address)
      const network = OPSTACK_NETWORKS.find(
        (n) => n.l1StandardBridge === logAddress,
      )
      if (!network) return

      // L1 finalization of L2->L1 withdrawal
      const erc20BridgeFinalized = parseERC20BridgeFinalized(input.log, [
        network.l1StandardBridge,
      ])
      if (erc20BridgeFinalized) {
        // Find the WithdrawalFinalized event in the same transaction
        const withdrawalFinalizedLog = input.txLogs.find((log) => {
          const parsed = parseWithdrawalFinalized(log, [network.optimismPortal])
          return parsed !== undefined
        })

        if (withdrawalFinalizedLog) {
          const withdrawalFinalized = parseWithdrawalFinalized(
            withdrawalFinalizedLog,
            [network.optimismPortal],
          )
          if (withdrawalFinalized) {
            return [
              ERC20BridgeFinalizedWithdrawalFinalized.create(input, {
                chain: network.chain,
                withdrawalHash: withdrawalFinalized.withdrawalHash,
                l1Token: Address32.from(erc20BridgeFinalized.l1Token),
                l2Token: Address32.from(erc20BridgeFinalized.l2Token),
                amount: erc20BridgeFinalized.amount,
              }),
            ]
          }
        }
      }

      // L1 finalization of L2->L1 ETH withdrawal
      const ethBridgeFinalizedL1 = parseETHBridgeFinalized(input.log, [
        network.l1StandardBridge,
      ])
      if (ethBridgeFinalizedL1) {
        // Find the WithdrawalFinalized event in the same transaction
        const withdrawalFinalizedLog = input.txLogs.find((log) => {
          const parsed = parseWithdrawalFinalized(log, [network.optimismPortal])
          return parsed !== undefined
        })

        if (withdrawalFinalizedLog) {
          const withdrawalFinalized = parseWithdrawalFinalized(
            withdrawalFinalizedLog,
            [network.optimismPortal],
          )
          if (withdrawalFinalized) {
            return [
              ETHBridgeFinalizedWithdrawalFinalized.create(input, {
                chain: network.chain,
                withdrawalHash: withdrawalFinalized.withdrawalHash,
                amount: ethBridgeFinalizedL1.amount,
              }),
            ]
          }
        }
      }

      // L1 -> L2 ERC20 deposit initiated
      const erc20DepositInitiated = parseERC20DepositInitiated(input.log, [
        network.l1StandardBridge,
      ])
      if (erc20DepositInitiated) {
        // Find the SentMessage event in the same transaction
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [network.l1CrossDomainMessenger])
          return parsed !== undefined
        })

        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            network.l1CrossDomainMessenger,
          ])
          if (sentMessage) {
            // see if we have SentMessageExtension1 event in the same tx
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === sentMessageLog.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [
                network.l1CrossDomainMessenger,
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
              ERC20DepositInitiatedSentMessage.create(input, {
                chain: network.chain,
                msgHash,
                l1Token: Address32.from(erc20DepositInitiated.l1Token),
                l2Token: Address32.from(erc20DepositInitiated.l2Token),
                amount: erc20DepositInitiated.amount,
              }),
            ]
          }
        }
      }

      // L1 -> L2 ETH deposit initiated
      const ethBridgeInitiated = parseETHBridgeInitiated(input.log, [
        network.l1StandardBridge,
      ])
      if (ethBridgeInitiated) {
        // Find the SentMessage event in the same transaction
        const sentMessageLog = input.txLogs.find((log) => {
          const parsed = parseSentMessage(log, [network.l1CrossDomainMessenger])
          return parsed !== undefined
        })

        if (sentMessageLog) {
          const sentMessage = parseSentMessage(sentMessageLog, [
            network.l1CrossDomainMessenger,
          ])
          if (sentMessage) {
            // see if we have SentMessageExtension1 event in the same tx
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === sentMessageLog.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [
                network.l1CrossDomainMessenger,
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
              ETHBridgeInitiatedSentMessage.create(input, {
                chain: network.chain,
                msgHash,
                amount: ethBridgeInitiated.amount,
              }),
            ]
          }
        }
      }
    }
  }

  matchTypes = [
    ERC20BridgeFinalizedWithdrawalFinalized,
    ETHBridgeFinalizedWithdrawalFinalized,
    DepositFinalizedRelayedMessage,
    ETHBridgeFinalizedRelayedMessage,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L2->L1 ERC20 withdrawals
    if (ERC20BridgeFinalizedWithdrawalFinalized.checkType(event)) {
      const erc20BridgeInitiated = db.find(ERC20BridgeInitiatedMessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!erc20BridgeInitiated) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'opstack-standardbridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
        }),
        Result.Transfer('opstack-standardbridge.L2ToL1Transfer', {
          srcEvent: erc20BridgeInitiated,
          srcAmount: erc20BridgeInitiated.args.amount,
          srcTokenAddress: erc20BridgeInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }

    // Match L2->L1 ETH withdrawals
    if (ETHBridgeFinalizedWithdrawalFinalized.checkType(event)) {
      const ethBridgeInitiated = db.find(ETHBridgeInitiatedMessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!ethBridgeInitiated) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'opstack-standardbridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
        }),
        Result.Transfer('opstack-standardbridge.L2ToL1Transfer', {
          srcEvent: ethBridgeInitiated,
          srcAmount: ethBridgeInitiated.args.amount,
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }

    // Match L1->L2 ERC20 deposits
    if (DepositFinalizedRelayedMessage.checkType(event)) {
      const erc20DepositInitiated = db.find(ERC20DepositInitiatedSentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!erc20DepositInitiated) return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'opstack-standardbridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('opstack-standardbridge.L1ToL2Transfer', {
          srcEvent: erc20DepositInitiated,
          srcAmount: erc20DepositInitiated.args.amount,
          srcTokenAddress: erc20DepositInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // Match L1->L2 ETH deposits
    if (ETHBridgeFinalizedRelayedMessage.checkType(event)) {
      const ethBridgeInitiated = db.find(ETHBridgeInitiatedSentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!ethBridgeInitiated) return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'opstack-standardbridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('opstack-standardbridge.L1ToL2Transfer', {
          srcEvent: ethBridgeInitiated,
          srcAmount: ethBridgeInitiated.args.amount,
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }
}
