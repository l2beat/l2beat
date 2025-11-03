import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  Address32,
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
  localToken: Address32
  remoteToken: Address32
  amount: string
}>('opstack.MessagePassedERC20BridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

const parseERC20BridgeInitiated = createEventParser(
  'event ERC20BridgeInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L1 finalization of L2->L1 withdrawal
const ERC20BridgeFinalizedWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  localToken: Address32
  remoteToken: Address32
  amount: string
}>('opstack.WithdrawalFinalizedERC20BridgeFinalized')

const parseERC20BridgeFinalized = createEventParser(
  'event ERC20BridgeFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L1 -> L2 deposit initiated
const ERC20DepositInitiatedSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  localToken: Address32
  remoteToken: Address32
  amount: string
}>('opstack.SentMessageERC20DepositInitiated')

const parseERC20DepositInitiated = createEventParser(
  'event ERC20DepositInitiated(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

// L2 relay of L1->L2 deposit
const DepositFinalizedRelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
  localToken: Address32
  remoteToken: Address32
  amount: string
}>('opstack.RelayedMessageDepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed localToken, address indexed remoteToken, address indexed from, address to, uint256 amount, bytes extraData)',
)

// ETH Bridge events
const ETHBridgeInitiatedSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: string
}>('opstack.SentMessageETHBridgeInitiated')

const parseETHBridgeInitiated = createEventParser(
  'event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)',
)

const ETHBridgeFinalizedRelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: string
}>('opstack.RelayedMessageETHBridgeFinalized')

const parseETHBridgeFinalized = createEventParser(
  'event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)',
)

// L2 -> L1 ETH withdrawal initiated
const ETHBridgeInitiatedMessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: string
}>('opstack.MessagePassedETHBridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization of L2->L1 ETH withdrawal
const ETHBridgeFinalizedWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: string
}>('opstack.WithdrawalFinalizedETHBridgeFinalized')

export class OpStackStandardBridgePlugin implements InteropPlugin {
  name = 'opstack-standardbridge'

  capture(input: LogToCapture) {
    // L2 -> L1 withdrawal initiated
    if (input.ctx.chain !== 'ethereum') {
      const network = OPSTACK_NETWORKS.find((x) => x.chain === input.ctx.chain)
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
              ERC20BridgeInitiatedMessagePassed.create(input.ctx, {
                chain: network.chain,
                withdrawalHash: messagePassed.withdrawalHash,
                localToken: Address32.from(erc20BridgeInitiated.localToken),
                remoteToken: Address32.from(erc20BridgeInitiated.remoteToken),
                amount: erc20BridgeInitiated.amount.toString(),
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
              ETHBridgeInitiatedMessagePassed.create(input.ctx, {
                chain: network.chain,
                withdrawalHash: messagePassed.withdrawalHash,
                amount: ethBridgeInitiatedL2.amount.toString(),
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
              DepositFinalizedRelayedMessage.create(input.ctx, {
                chain: network.chain,
                msgHash: relayedMessage.msgHash,
                localToken: Address32.from(depositFinalized.localToken),
                remoteToken: Address32.from(depositFinalized.remoteToken),
                amount: depositFinalized.amount.toString(),
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
              ETHBridgeFinalizedRelayedMessage.create(input.ctx, {
                chain: network.chain,
                msgHash: relayedMessage.msgHash,
                amount: ethBridgeFinalized.amount.toString(),
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
              ERC20BridgeFinalizedWithdrawalFinalized.create(input.ctx, {
                chain: network.chain,
                withdrawalHash: withdrawalFinalized.withdrawalHash,
                localToken: Address32.from(erc20BridgeFinalized.localToken),
                remoteToken: Address32.from(erc20BridgeFinalized.remoteToken),
                amount: erc20BridgeFinalized.amount.toString(),
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
              ETHBridgeFinalizedWithdrawalFinalized.create(input.ctx, {
                chain: network.chain,
                withdrawalHash: withdrawalFinalized.withdrawalHash,
                amount: ethBridgeFinalizedL1.amount.toString(),
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
              ERC20DepositInitiatedSentMessage.create(input.ctx, {
                chain: network.chain,
                msgHash,
                localToken: Address32.from(erc20DepositInitiated.localToken),
                remoteToken: Address32.from(erc20DepositInitiated.remoteToken),
                amount: erc20DepositInitiated.amount.toString(),
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
              ETHBridgeInitiatedSentMessage.create(input.ctx, {
                chain: network.chain,
                msgHash,
                amount: ethBridgeInitiated.amount.toString(),
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
          srcAmount: BigInt(erc20BridgeInitiated.args.amount),
          srcTokenAddress: erc20BridgeInitiated.args.localToken,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: event.args.localToken,
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
          srcAmount: BigInt(ethBridgeInitiated.args.amount),
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
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
          srcAmount: BigInt(erc20DepositInitiated.args.amount),
          srcTokenAddress: erc20DepositInitiated.args.localToken,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: event.args.localToken,
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
          srcAmount: BigInt(ethBridgeInitiated.args.amount),
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: Address32.NATIVE,
        }),
      ]
    }
  }
}
