/*
WETH gateway plugin. Handles WETH-specific deposit/withdrawal tracking.

Must run before the core plugin in the cluster so it can capture L2ToL1Tx
events for WETH withdrawals, preventing them from being misclassified as
plain ETH withdrawals.
*/

import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
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

// --- L1→L2 WETH deposits ---

const WethDepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  amount: bigint
}>('orbitstack-wethgateway.WethDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

const WethDepositFinalized = createInteropEventType<{
  chain: string
  amount: bigint
}>('orbitstack-wethgateway.WethDepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

// --- L2→L1 WETH withdrawals ---

const WethWithdrawalInitiatedL2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  amount: bigint
}>('orbitstack-wethgateway.WethWithdrawalInitiated')

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
)

const WethWithdrawalFinalizedOutBoxTransactionExecuted =
  createInteropEventType<{
    chain: string
    position: number
    amount: bigint
  }>('orbitstack-wethgateway.WethWithdrawalFinalized')

const parseWethWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)',
)

export class OrbitStackWethGatewayPlugin implements InteropPlugin {
  readonly name = 'orbitstack-wethgateway'

  capture(input: LogToCapture) {
    const isParentChain = ORBITSTACK_NETWORKS.some(
      (n) => n.parentChain === input.chain,
    )
    if (isParentChain) {
      const logAddress = EthereumAddress(input.log.address)
      const network = ORBITSTACK_NETWORKS.find(
        (n) =>
          n.parentChain === input.chain &&
          n.l1WethGateway &&
          logAddress === addr(n.l1WethGateway),
      )
      const l1WethGateway = network?.l1WethGateway
      const l1Weth = network?.l1Weth
      if (network && l1WethGateway && l1Weth) {
        const depositInitiated = parseDepositInitiated(input.log, [
          addr(l1WethGateway),
        ])
        if (depositInitiated) {
          if (EthereumAddress(depositInitiated._l1Token) !== addr(l1Weth)) {
            return
          }

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
                WethDepositInitiatedMessageDelivered.create(input, {
                  chain: network.chain,
                  messageNum: messageDelivered.messageIndex.toString(),
                  amount: depositInitiated._amount,
                }),
              ]
            }
          }
        }

        const wethWithdrawalFinalized = parseWethWithdrawalFinalized(
          input.log,
          [addr(l1WethGateway)],
        )
        if (wethWithdrawalFinalized) {
          if (
            EthereumAddress(wethWithdrawalFinalized.l1Token) !== addr(l1Weth)
          ) {
            return
          }

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
                WethWithdrawalFinalizedOutBoxTransactionExecuted.create(input, {
                  chain: network.chain,
                  position: Number(outBoxTx.transactionIndex),
                  amount: wethWithdrawalFinalized._amount,
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

    // Capture L2ToL1Tx for WETH withdrawals before the base plugin can claim it
    const l2ToL1Tx = parseL2ToL1Tx(input.log, [addr(childNetwork.arbsys)])
    if (l2ToL1Tx) {
      const wethWithdrawalLog = input.txLogs.find((log) => {
        if (
          !childNetwork.l2WethGateway ||
          EthereumAddress(log.address) !== addr(childNetwork.l2WethGateway)
        ) {
          return false
        }
        const parsed = parseWithdrawalInitiated(log, [
          addr(childNetwork.l2WethGateway),
        ])
        return (
          parsed !== undefined &&
          childNetwork.l1Weth &&
          EthereumAddress(parsed.l1Token) === addr(childNetwork.l1Weth) &&
          Number(parsed._l2ToL1Id) === Number(l2ToL1Tx.position)
        )
      })

      if (wethWithdrawalLog) {
        return [
          L2ToL1Tx.create(input, {
            chain: childNetwork.chain,
            position: Number(l2ToL1Tx.position),
          }),
        ]
      }
    }

    if (
      !childNetwork.l2WethGateway ||
      EthereumAddress(input.log.address) !== addr(childNetwork.l2WethGateway)
    )
      return

    const depositFinalized = parseDepositFinalized(input.log, [
      addr(childNetwork.l2WethGateway),
    ])
    if (depositFinalized) {
      if (
        !childNetwork.l1Weth ||
        EthereumAddress(depositFinalized.l1Token) !== addr(childNetwork.l1Weth)
      ) {
        return
      }

      const transferLog = input.txLogs.find((log) => {
        if (
          !childNetwork.l2Weth ||
          EthereumAddress(log.address) !== addr(childNetwork.l2Weth)
        ) {
          return false
        }
        const parsed = parseTransfer(log, [addr(childNetwork.l2Weth)])
        return (
          parsed !== undefined &&
          (parsed.from === '0x0000000000000000000000000000000000000000' ||
            EthereumAddress(parsed.from) ===
              addr(childNetwork.l2WethGateway)) &&
          parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
        )
      })

      if (transferLog) {
        return [
          WethDepositFinalized.create(input, {
            chain: childNetwork.chain,
            amount: depositFinalized.amount,
          }),
        ]
      }
    }

    const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
      addr(childNetwork.l2WethGateway),
    ])
    if (withdrawalInitiated) {
      if (
        !childNetwork.l1Weth ||
        EthereumAddress(withdrawalInitiated.l1Token) !==
          addr(childNetwork.l1Weth)
      ) {
        return
      }

      const transferLog = input.txLogs.find((log) => {
        if (
          !childNetwork.l2Weth ||
          EthereumAddress(log.address) !== addr(childNetwork.l2Weth)
        ) {
          return false
        }
        const parsed = parseTransfer(log, [addr(childNetwork.l2Weth)])
        return (
          parsed !== undefined &&
          parsed.to === '0x0000000000000000000000000000000000000000' &&
          parsed.from.toLowerCase() === withdrawalInitiated._from.toLowerCase()
        )
      })

      if (!transferLog) return

      return [
        WethWithdrawalInitiatedL2ToL1Tx.create(input, {
          chain: childNetwork.chain,
          position: Number(withdrawalInitiated._l2ToL1Id),
          amount: withdrawalInitiated._amount,
        }),
      ]
    }
  }

  matchTypes = [
    WethDepositFinalized,
    WethWithdrawalFinalizedOutBoxTransactionExecuted,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (WethDepositFinalized.checkType(event)) {
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

      const depositInitiated = db.find(WethDepositInitiatedMessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!depositInitiated) return

      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      if (!network?.l1Weth || !network.l2Weth) return

      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'orbitstack-wethgateway',
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: Address32.from(addr(network.l1Weth)),
          srcWasBurned: false,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.from(addr(network.l2Weth)),
          dstWasMinted: true,
        }),
      ]
    }

    if (WethWithdrawalFinalizedOutBoxTransactionExecuted.checkType(event)) {
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

      const withdrawalInitiated = db.find(WethWithdrawalInitiatedL2ToL1Tx, {
        position: event.args.position,
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      if (!network?.l1Weth || !network.l2Weth) return

      return [
        Result.Message('orbitstack.L2ToL1Message', {
          app: 'orbitstack-wethgateway',
          srcEvent: l2ToL1Tx,
          dstEvent: outBoxTransactionExecuted,
        }),
        Result.Transfer('orbitstack.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: Address32.from(addr(network.l2Weth)),
          srcWasBurned: true,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.from(addr(network.l1Weth)),
          dstWasMinted: false,
        }),
      ]
    }
  }
}
