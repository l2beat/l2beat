/*
Standard gateway plugin. Handles ERC20 deposits/withdrawals through
the default L1/L2 standard gateway pair (lock on L1, mint on L2).
*/

import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
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
  L2ToL1Tx,
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  OutBoxTransactionExecuted,
  parseL2ToL1Tx,
  parseMessageDelivered,
  parseOutBoxTransactionExecuted,
  RedeemScheduled,
} from './orbitstack'

const addr = ChainSpecificAddress.address

// --- L1→L2 ERC20 deposits ---

const DepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  l1Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.MessageDeliveredDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

// --- L2→L1 ERC20 withdrawals ---

const WithdrawalInitiatedL2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.L2ToL1TxWithdrawalInitiated', {
  ttl: 30 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
)

const WithdrawalFinalizedOutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)',
)

export class OrbitStackStandardGatewayPlugin implements InteropPlugin {
  readonly name = 'orbitstack-standardgateway'

  capture(input: LogToCapture) {
    const isParentChain = ORBITSTACK_NETWORKS.some(
      (n) => n.parentChain === input.chain,
    )
    if (isParentChain) {
      const logAddress = EthereumAddress(input.log.address)
      const network = ORBITSTACK_NETWORKS.find(
        (n) =>
          n.parentChain === input.chain &&
          n.l1StandardGateway &&
          logAddress === addr(n.l1StandardGateway),
      )
      const l1StandardGateway = network?.l1StandardGateway
      if (network && l1StandardGateway) {
        const depositInitiated = parseDepositInitiated(input.log, [
          addr(l1StandardGateway),
        ])
        if (depositInitiated) {
          // sequenceNumber in DepositInitiated == messageIndex in MessageDelivered
          const messageDeliveredLog = input.txLogs.find((log) => {
            const parsed = parseMessageDelivered(log, [addr(network.bridge)])
            return (
              parsed !== undefined &&
              parsed.messageIndex === depositInitiated._sequenceNumber
            )
          })

          if (messageDeliveredLog) {
            const messageDelivered = parseMessageDelivered(
              messageDeliveredLog,
              [addr(network.bridge)],
            )
            if (messageDelivered) {
              return [
                DepositInitiatedMessageDelivered.create(input, {
                  chain: network.chain,
                  messageNum: messageDelivered.messageIndex.toString(),
                  l1Token: Address32.from(depositInitiated._l1Token),
                  amount: depositInitiated._amount,
                }),
              ]
            }
          }
        }

        const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
          addr(l1StandardGateway),
        ])
        if (withdrawalFinalized) {
          const outBoxTxLog = input.txLogs.find((log) => {
            const parsed = parseOutBoxTransactionExecuted(log, [
              addr(network.outbox),
            ])
            return parsed !== undefined
          })

          if (outBoxTxLog) {
            const outBoxTx = parseOutBoxTransactionExecuted(outBoxTxLog, [
              addr(network.outbox),
            ])
            if (outBoxTx) {
              return [
                WithdrawalFinalizedOutBoxTransactionExecuted.create(input, {
                  chain: network.chain,
                  position: Number(outBoxTx.transactionIndex),
                  l1Token: Address32.from(withdrawalFinalized.l1Token),
                  amount: withdrawalFinalized._amount,
                }),
              ]
            }
          }
        }
      }
    }

    // A chain can be both parent and child (e.g. Arbitrum is parent for ApeChain)
    const childNetwork = ORBITSTACK_NETWORKS.find(
      (n) => n.chain === input.chain,
    )
    if (!childNetwork) return

    if (
      !childNetwork.l2StandardGateway ||
      EthereumAddress(input.log.address) !==
        addr(childNetwork.l2StandardGateway)
    )
      return

    const depositFinalized = parseDepositFinalized(input.log, null)
    if (depositFinalized) {
      // Find mint Transfer to get L2 token address
      const transferLog = input.txLogs.find((log) => {
        const parsed = parseTransfer(log, null)
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
            DepositFinalized.create(input, {
              chain: childNetwork.chain,
              l1Token: Address32.from(depositFinalized.l1Token),
              l2Token: Address32.from(transferLog.address),
              amount: depositFinalized.amount,
            }),
          ]
        }
      }
    }

    const withdrawalInitiated = parseWithdrawalInitiated(input.log, null)
    if (withdrawalInitiated) {
      // _l2ToL1Id in WithdrawalInitiated == position in L2ToL1Tx
      const l2ToL1TxLog = input.txLogs.find((log) => {
        const parsed = parseL2ToL1Tx(log, [addr(childNetwork.arbsys)])
        return (
          parsed !== undefined &&
          Number(parsed.position) === Number(withdrawalInitiated._l2ToL1Id)
        )
      })

      if (l2ToL1TxLog) {
        const l2ToL1Tx = parseL2ToL1Tx(l2ToL1TxLog, [addr(childNetwork.arbsys)])
        if (l2ToL1Tx) {
          // Find burn Transfer to get L2 token address
          const transferLog = input.txLogs.find((log) => {
            const parsed = parseTransfer(log, null)
            return (
              parsed !== undefined &&
              parsed.to === '0x0000000000000000000000000000000000000000' &&
              parsed.from.toLowerCase() ===
                withdrawalInitiated._from.toLowerCase()
            )
          })

          if (transferLog) {
            return [
              WithdrawalInitiatedL2ToL1Tx.create(input, {
                chain: childNetwork.chain,
                position: Number(l2ToL1Tx.position),
                l1Token: Address32.from(withdrawalInitiated.l1Token),
                l2Token: Address32.from(transferLog.address),
                amount: withdrawalInitiated._amount,
              }),
            ]
          }
        }
      }
    }
  }

  matchTypes = [DepositFinalized, WithdrawalFinalizedOutBoxTransactionExecuted]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
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
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: withdrawalInitiated.args.l2Token,
          srcWasBurned: true,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
          dstWasMinted: false,
        }),
      ]
    }

    if (DepositFinalized.checkType(event)) {
      // RedeemScheduled (Type 0x69 tx) references DepositFinalized (Type 0x68 tx) via retryTxHash
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
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: depositInitiated.args.l1Token,
          srcWasBurned: false,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
          dstWasMinted: true,
        }),
      ]
    }
  }
}
