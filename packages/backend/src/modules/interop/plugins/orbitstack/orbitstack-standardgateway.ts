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
  L2ToL1Tx,
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  OutBoxTransactionExecuted,
  parseL2ToL1Tx,
  parseMessageDelivered,
  parseOutBoxTransactionExecuted,
  RedeemScheduled,
} from './orbitstack'

// == L1 -> L2 ERC20 deposits ==

// L1 initiation of L1->L2 ERC20 deposit
const DepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  l1Token: Address32
  amount: string
}>('orbitstack-standardgateway.MessageDeliveredDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

// L2 finalization of L1->L2 ERC20 deposit (Type 0x68 transaction)
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: string
}>('orbitstack-standardgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

// == L2 -> L1 ERC20 withdrawals ==

// L2 initiation of L2->L1 ERC20 withdrawal
const WithdrawalInitiatedL2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  l2Token: Address32
  amount: string
}>('orbitstack-standardgateway.L2ToL1TxWithdrawalInitiated', {
  ttl: 14 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
)

// L1 finalization of L2->L1 ERC20 withdrawal
const WithdrawalFinalizedOutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  amount: string
}>('orbitstack-standardgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 exitNum, uint256 amount)',
)

export class OrbitStackStandardGatewayPlugin implements InteropPlugin {
  name = 'orbitstack-standardgateway'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      // L1 -> L2 ERC20 deposit initiated
      const network = ORBITSTACK_NETWORKS.find(
        (n) => EthereumAddress(input.log.address) === n.l1StandardGateway,
      )
      if (!network) return

      const depositInitiated = parseDepositInitiated(input.log, [
        network.l1StandardGateway,
      ])
      if (depositInitiated) {
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
          const messageDelivered = parseMessageDelivered(messageDeliveredLog, [
            network.bridge,
          ])
          if (messageDelivered) {
            return [
              DepositInitiatedMessageDelivered.create(input.ctx, {
                chain: network.chain,
                messageNum: messageDelivered.messageIndex.toString(),
                l1Token: Address32.from(depositInitiated._l1Token),
                amount: depositInitiated._amount.toString(),
              }),
            ]
          }
        }
      }

      // L1 finalization of L2->L1 ERC20 withdrawal
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        network.l1StandardGateway,
      ])
      if (withdrawalFinalized) {
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
              WithdrawalFinalizedOutBoxTransactionExecuted.create(input.ctx, {
                chain: network.chain,
                position: Number(outBoxTx.transactionIndex),
                l1Token: Address32.from(withdrawalFinalized.l1Token),
                amount: withdrawalFinalized.amount.toString(),
              }),
            ]
          }
        }
      }
    } else {
      // L2 operations
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )
      if (!network) return

      // Check if this is from the L2 standard gateway
      if (EthereumAddress(input.log.address) !== network.l2StandardGateway)
        return

      // L2 finalization of L1->L2 ERC20 deposit (Type 0x68 transaction)
      const depositFinalized = parseDepositFinalized(input.log, null)
      if (depositFinalized) {
        // Find the Transfer event (minting) in the same transaction to get L2 token address
        const transferLog = input.txLogs.find((log) => {
          const parsed = parseTransfer(log, null)
          // Look for mint (from == 0x0) to the recipient
          return (
            parsed !== undefined &&
            parsed.from === '0x0000000000000000000000000000000000000000' &&
            parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
          )
        })

        if (transferLog) {
          const transfer = parseTransfer(transferLog, null)
          if (transfer) {
            return [
              DepositFinalized.create(input.ctx, {
                chain: network.chain,
                l1Token: Address32.from(depositFinalized.l1Token),
                l2Token: Address32.from(transferLog.address),
                amount: depositFinalized.amount.toString(),
              }),
            ]
          }
        }
      }

      // L2 -> L1 ERC20 withdrawal initiated
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, null)
      if (withdrawalInitiated) {
        // Find the L2ToL1Tx event in the same transaction to get position
        const l2ToL1TxLog = input.txLogs.find((log) => {
          const parsed = parseL2ToL1Tx(log, [network.arbsys])
          // The _l2ToL1Id in WithdrawalInitiated equals the position in L2ToL1Tx
          return (
            parsed !== undefined &&
            Number(parsed.position) === Number(withdrawalInitiated._l2ToL1Id)
          )
        })

        if (l2ToL1TxLog) {
          const l2ToL1Tx = parseL2ToL1Tx(l2ToL1TxLog, [network.arbsys])
          if (l2ToL1Tx) {
            // Find the Transfer event (burning) to get L2 token address
            const transferLog = input.txLogs.find((log) => {
              const parsed = parseTransfer(log, null)
              // Look for burn (to == 0x0) from the sender
              return (
                parsed !== undefined &&
                parsed.to === '0x0000000000000000000000000000000000000000' &&
                parsed.from.toLowerCase() ===
                  withdrawalInitiated._from.toLowerCase()
              )
            })

            if (transferLog) {
              return [
                WithdrawalInitiatedL2ToL1Tx.create(input.ctx, {
                  chain: network.chain,
                  position: Number(l2ToL1Tx.position),
                  l1Token: Address32.from(withdrawalInitiated.l1Token),
                  l2Token: Address32.from(transferLog.address),
                  amount: withdrawalInitiated._amount.toString(),
                }),
              ]
            }
          }
        }
      }
    }
  }

  matchTypes = [DepositFinalized, WithdrawalFinalizedOutBoxTransactionExecuted]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L2->L1 ERC20 withdrawals
    if (WithdrawalFinalizedOutBoxTransactionExecuted.checkType(event)) {
      const withdrawalInitiated = db.find(WithdrawalInitiatedL2ToL1Tx, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

      const l2ToL1Tx = db.find(L2ToL1Tx, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!l2ToL1Tx) return

      const outBoxTransactionExecuted = db.find(OutBoxTransactionExecuted, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!outBoxTransactionExecuted) return

      return [
        Result.Message('orbitstack.L2ToL1Message', {
          app: 'orbitstack-standardgateway',
          srcEvent: l2ToL1Tx,
          dstEvent: outBoxTransactionExecuted,
        }),
        Result.Transfer('orbitstack.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: BigInt(withdrawalInitiated.args.amount),
          srcTokenAddress: withdrawalInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }

    // Match L1->L2 ERC20 deposits
    if (DepositFinalized.checkType(event)) {
      // Find RedeemScheduled that references this transaction via retryTxHash
      // RedeemScheduled is in Type 0x69 tx, DepositFinalized is in Type 0x68 tx
      // RedeemScheduled.retryTxHash points to DepositFinalized's txHash
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

      // Find the L1 DepositInitiated event with token details
      const depositInitiated = db.find(DepositInitiatedMessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!depositInitiated) return

      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'orbitstack-standardgateway',
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: BigInt(depositInitiated.args.amount),
          srcTokenAddress: depositInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }
  }
}
