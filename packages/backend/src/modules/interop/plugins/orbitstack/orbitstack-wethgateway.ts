import { EthereumAddress } from '@l2beat/shared-pure'
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
  L2ToL1Tx,
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  OutBoxTransactionExecuted,
  parseL2ToL1Tx,
  parseMessageDelivered,
  parseOutBoxTransactionExecuted,
  RedeemScheduled,
} from './orbitstack'

// == L1 -> L2 WETH deposits ==

// L1 initiation of L1->L2 WETH deposit
const WethDepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  amount: string
}>('orbitstack-wethgateway.WethDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

// L2 finalization of L1->L2 WETH deposit
const WethDepositFinalized = createInteropEventType<{
  chain: string
  amount: string
}>('orbitstack-wethgateway.WethDepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

// == L2 -> L1 WETH withdrawals ==

// L2 initiation of L2->L1 WETH withdrawal
const WethWithdrawalInitiatedL2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  amount: string
}>('orbitstack-wethgateway.WethWithdrawalInitiated')

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
)

// L1 finalization of L2->L1 WETH withdrawal
const WethWithdrawalFinalizedOutBoxTransactionExecuted =
  createInteropEventType<{
    chain: string
    position: number
    amount: string
  }>('orbitstack-wethgateway.WethWithdrawalFinalized')

const parseWethWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)',
)

export class OrbitStackWethGatewayPlugin implements InteropPlugin {
  name = 'orbitstack-wethgateway'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      // L1 -> L2 WETH deposit initiated
      const network = ORBITSTACK_NETWORKS.find(
        (n) => EthereumAddress(input.log.address) === n.l1WethGateway,
      )
      if (network) {
        const depositInitiated = parseDepositInitiated(input.log, [
          network.l1WethGateway,
        ])
        if (depositInitiated) {
          // Verify this is for WETH
          if (EthereumAddress(depositInitiated._l1Token) !== network.l1Weth) {
            return
          }

          // Find MessageDelivered in the same transaction
          const messageDeliveredLog = input.txLogs.find((log) => {
            const parsed = parseMessageDelivered(log, [network.bridge])
            // The sequenceNumber in DepositInitiated equals the messageIndex in MessageDelivered
            return (
              parsed !== undefined &&
              parsed.messageIndex === depositInitiated._sequenceNumber
            )
          })

          if (messageDeliveredLog) {
            const messageDelivered = parseMessageDelivered(
              messageDeliveredLog,
              [network.bridge],
            )
            if (messageDelivered) {
              return [
                WethDepositInitiatedMessageDelivered.create(input.ctx, {
                  chain: network.chain,
                  messageNum: messageDelivered.messageIndex.toString(),
                  amount: depositInitiated._amount.toString(),
                }),
              ]
            }
          }
        }

        // L1 finalization of L2->L1 WETH withdrawal
        const wethWithdrawalFinalized = parseWethWithdrawalFinalized(
          input.log,
          [network.l1WethGateway],
        )
        if (wethWithdrawalFinalized) {
          // Verify this is for WETH
          if (
            EthereumAddress(wethWithdrawalFinalized.l1Token) !== network.l1Weth
          ) {
            return
          }

          // Find OutBoxTransactionExecuted in the same transaction
          const outBoxTxLog = input.txLogs.find((log) => {
            const parsed = parseOutBoxTransactionExecuted(log, [network.outbox])
            return parsed !== undefined
          })

          if (outBoxTxLog) {
            const outBoxTx = parseOutBoxTransactionExecuted(outBoxTxLog, [
              network.outbox,
            ])
            if (outBoxTx) {
              return [
                WethWithdrawalFinalizedOutBoxTransactionExecuted.create(
                  input.ctx,
                  {
                    chain: network.chain,
                    position: Number(outBoxTx.transactionIndex),
                    amount: wethWithdrawalFinalized._amount.toString(),
                  },
                ),
              ]
            }
          }
        }
      }
    } else {
      // L2 operations
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )
      if (!network) return

      // First, check if this is an L2ToL1Tx event from ArbSys (for WETH withdrawals)
      // This needs to run BEFORE the base plugin to prevent misclassification
      const l2ToL1Tx = parseL2ToL1Tx(input.log, [network.arbsys])
      if (l2ToL1Tx) {
        // Check if this L2ToL1Tx is part of a WETH withdrawal
        // by looking for a WithdrawalInitiated event in the same transaction
        const wethWithdrawalLog = input.txLogs.find((log) => {
          if (EthereumAddress(log.address) !== network.l2WethGateway) {
            return false
          }
          const parsed = parseWithdrawalInitiated(log, [network.l2WethGateway])
          return (
            parsed !== undefined &&
            EthereumAddress(parsed.l1Token) === network.l1Weth &&
            Number(parsed._l2ToL1Id) === Number(l2ToL1Tx.position)
          )
        })

        if (wethWithdrawalLog) {
          // This is a WETH withdrawal! Capture it to prevent base plugin from seeing it
          return [
            L2ToL1Tx.create(input.ctx, {
              chain: network.chain,
              position: Number(l2ToL1Tx.position),
            }),
          ]
        }
      }

      // Check if this is from the L2 WETH gateway
      if (EthereumAddress(input.log.address) !== network.l2WethGateway) return

      // L2 finalization of L1->L2 WETH deposit
      const depositFinalized = parseDepositFinalized(input.log, [
        network.l2WethGateway,
      ])
      if (depositFinalized) {
        // Verify this is for WETH
        if (EthereumAddress(depositFinalized.l1Token) !== network.l1Weth) {
          return
        }

        // Find the Transfer event (minting) in the same transaction to verify L2 WETH
        const transferLog = input.txLogs.find((log) => {
          if (EthereumAddress(log.address) !== network.l2Weth) {
            return false
          }
          const parsed = parseTransfer(log, [network.l2Weth])
          // Look for mint (from == 0x0 or from == gateway) to the recipient
          return (
            parsed !== undefined &&
            (parsed.from === '0x0000000000000000000000000000000000000000' ||
              EthereumAddress(parsed.from) === network.l2WethGateway) &&
            parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
          )
        })

        if (transferLog) {
          return [
            WethDepositFinalized.create(input.ctx, {
              chain: network.chain,
              amount: depositFinalized.amount.toString(),
            }),
          ]
        }
      }

      // L2 initiation of L2->L1 WETH withdrawal
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        network.l2WethGateway,
      ])
      if (withdrawalInitiated) {
        // Verify this is for WETH
        if (EthereumAddress(withdrawalInitiated.l1Token) !== network.l1Weth) {
          return
        }

        // Find the Transfer event (burning) to verify L2 WETH
        const transferLog = input.txLogs.find((log) => {
          if (EthereumAddress(log.address) !== network.l2Weth) {
            return false
          }
          const parsed = parseTransfer(log, [network.l2Weth])
          // Look for burn (to == 0x0)
          return (
            parsed !== undefined &&
            parsed.to === '0x0000000000000000000000000000000000000000' &&
            parsed.from.toLowerCase() ===
              withdrawalInitiated._from.toLowerCase()
          )
        })

        if (!transferLog) return

        // Return the WETH-specific withdrawal initiated event
        // The L2ToL1Tx event is captured separately above
        return [
          WethWithdrawalInitiatedL2ToL1Tx.create(input.ctx, {
            chain: network.chain,
            position: Number(withdrawalInitiated._l2ToL1Id),
            amount: withdrawalInitiated._amount.toString(),
          }),
        ]
      }
    }
  }

  matchTypes = [
    WethDepositFinalized,
    WethWithdrawalFinalizedOutBoxTransactionExecuted,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L1->L2 WETH deposits
    if (WethDepositFinalized.checkType(event)) {
      // Find RedeemScheduled that references this transaction via retryTxHash
      const redeemScheduled = db.find(RedeemScheduled, {
        retryTxHash: event.ctx.txHash,
        chain: event.ctx.chain,
      })
      if (!redeemScheduled) return

      const messageDelivered = db.find(MessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!messageDelivered) return

      // Find the L1 WethDepositInitiated event with token details
      const depositInitiated = db.find(WethDepositInitiatedMessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!depositInitiated) return

      // Look up WETH addresses from network config
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      if (!network) return

      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'orbitstack-wethgateway',
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: BigInt(depositInitiated.args.amount),
          srcTokenAddress: Address32.from(network.l1Weth),
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: Address32.from(network.l2Weth),
        }),
      ]
    }

    // Match L2->L1 WETH withdrawals
    if (WethWithdrawalFinalizedOutBoxTransactionExecuted.checkType(event)) {
      // Find the L2ToL1Tx event for this position
      // We capture this ourselves before the base plugin sees it
      const l2ToL1Tx = db.find(L2ToL1Tx, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!l2ToL1Tx) return

      // Find the OutBoxTransactionExecuted event
      const outBoxTransactionExecuted = db.find(OutBoxTransactionExecuted, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!outBoxTransactionExecuted) return

      // Find the L2 withdrawal initiation event with token details
      const withdrawalInitiated = db.find(WethWithdrawalInitiatedL2ToL1Tx, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

      // Look up WETH addresses from network config
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      if (!network) return

      return [
        Result.Message('orbitstack.L2ToL1Message', {
          app: 'orbitstack-wethgateway',
          srcEvent: l2ToL1Tx,
          dstEvent: outBoxTransactionExecuted,
        }),
        Result.Transfer('orbitstack.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: BigInt(withdrawalInitiated.args.amount),
          srcTokenAddress: Address32.from(network.l2Weth),
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: Address32.from(network.l1Weth),
        }),
      ]
    }
  }
}
