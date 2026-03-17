import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
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
} from '../types'
import {
  L2ToL1Tx,
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  OutBoxTransactionExecuted,
  RedeemScheduled,
} from './orbitstack'

// == Event signatures ==

const depositInitiatedLog =
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)'
const depositFinalizedLog =
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)'
const withdrawalInitiatedLog =
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)'
const withdrawalFinalizedLog =
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

// == L1 -> L2 ERC20 deposits ==

// L1: DepositInitiated from L1StandardGateway
const DepositInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.DepositInitiated')

const parseDepositInitiated = createEventParser(depositInitiatedLog)

// L2: DepositFinalized from L2StandardGateway
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(depositFinalizedLog)

const parseTransfer = createEventParser(transferLog)

// == L2 -> L1 ERC20 withdrawals ==

// L2: WithdrawalInitiated from L2StandardGateway
const WithdrawalInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.WithdrawalInitiated', {
  ttl: 30 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(withdrawalInitiatedLog)

// L1: WithdrawalFinalized from L1StandardGateway
const WithdrawalFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  amount: bigint
}>('orbitstack-standardgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(withdrawalFinalizedLog)

export class OrbitStackStandardGatewayPlugin
  implements InteropPluginResyncable
{
  readonly name = 'orbitstack-standardgateway'

  getDataRequests(): DataRequest[] {
    return [
      // L1: DepositInitiated from L1StandardGateway
      {
        type: 'event',
        signature: depositInitiatedLog,
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l1StandardGateway),
      },
      // L1: WithdrawalFinalized from L1StandardGateway
      {
        type: 'event',
        signature: withdrawalFinalizedLog,
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l1StandardGateway),
      },
      // L2: DepositFinalized from L2StandardGateway (with Transfer for minting)
      {
        type: 'event',
        signature: depositFinalizedLog,
        includeTxEvents: [transferLog],
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l2StandardGateway),
      },
      // L2: WithdrawalInitiated from L2StandardGateway (with Transfer for burning)
      {
        type: 'event',
        signature: withdrawalInitiatedLog,
        includeTxEvents: [transferLog],
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l2StandardGateway),
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1 operations
      const logAddress = EthereumAddress(input.log.address)
      const network = ORBITSTACK_NETWORKS.find(
        (n) => ChainSpecificAddress.address(n.l1StandardGateway) === logAddress,
      )
      if (!network) return

      // L1 -> L2: DepositInitiated
      const depositInitiated = parseDepositInitiated(input.log, [
        ChainSpecificAddress.address(network.l1StandardGateway),
      ])
      if (depositInitiated) {
        return [
          DepositInitiated.create(input, {
            chain: network.chain,
            l1Token: Address32.from(depositInitiated._l1Token),
            amount: depositInitiated._amount,
          }),
        ]
      }

      // L2 -> L1: WithdrawalFinalized
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        ChainSpecificAddress.address(network.l1StandardGateway),
      ])
      if (withdrawalFinalized) {
        return [
          WithdrawalFinalized.create(input, {
            chain: network.chain,
            l1Token: Address32.from(withdrawalFinalized.l1Token),
            amount: withdrawalFinalized._amount,
          }),
        ]
      }
    } else {
      // L2 operations
      const network = ORBITSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return

      if (
        EthereumAddress(input.log.address) !==
        ChainSpecificAddress.address(network.l2StandardGateway)
      )
        return

      // L1 -> L2: DepositFinalized
      const depositFinalized = parseDepositFinalized(input.log, null)
      if (depositFinalized) {
        // Find the Transfer event (minting) to get L2 token address
        const transferLog = input.txLogs.find((log) => {
          const parsed = parseTransfer(log, null)
          return (
            parsed !== undefined &&
            parsed.from === '0x0000000000000000000000000000000000000000' &&
            parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
          )
        })

        if (transferLog) {
          return [
            DepositFinalized.create(input, {
              chain: network.chain,
              l1Token: Address32.from(depositFinalized.l1Token),
              l2Token: Address32.from(transferLog.address),
              amount: depositFinalized.amount,
            }),
          ]
        }
      }

      // L2 -> L1: WithdrawalInitiated
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, null)
      if (withdrawalInitiated) {
        // Find the Transfer event (burning) to get L2 token address
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
            WithdrawalInitiated.create(input, {
              chain: network.chain,
              l1Token: Address32.from(withdrawalInitiated.l1Token),
              l2Token: Address32.from(transferLog.address),
              amount: withdrawalInitiated._amount,
            }),
          ]
        }
      }
    }
  }

  matchTypes = [DepositFinalized, WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L2->L1 ERC20 withdrawals
    if (WithdrawalFinalized.checkType(event)) {
      // L1: OutBoxTransactionExecuted (N) → Transfer (N+1) → WithdrawalFinalized (N+2)
      const outBoxTransactionExecuted = db.find(OutBoxTransactionExecuted, {
        sameTxAtOffset: { event, offset: -2 },
        chain: event.args.chain,
      })
      if (!outBoxTransactionExecuted) return

      // L2: Find L2ToL1Tx by position
      const l2ToL1Tx = db.find(L2ToL1Tx, {
        position: outBoxTransactionExecuted.args.position,
        chain: event.args.chain,
      })
      if (!l2ToL1Tx) return

      // L2: L2ToL1Tx (N) → TxToL1 (N+1) → WithdrawalInitiated (N+2)
      const withdrawalInitiated = db.find(WithdrawalInitiated, {
        sameTxAtOffset: { event: l2ToL1Tx, offset: 2 },
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

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

    // Match L1->L2 ERC20 deposits
    if (DepositFinalized.checkType(event)) {
      // RedeemScheduled.retryTxHash points to DepositFinalized's txHash
      const redeemScheduled = db.find(RedeemScheduled, {
        retryTxHash: event.ctx.txHash,
        chain: event.ctx.chain,
      })
      if (!redeemScheduled) return

      // Find MessageDelivered by messageNum
      const messageDelivered = db.find(MessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!messageDelivered) return

      // L1: MessageDelivered (N) → InboxMessageDelivered (N+1) → TxToL2 (N+2) → DepositInitiated (N+3)
      const depositInitiated = db.find(DepositInitiated, {
        sameTxAtOffset: { event: messageDelivered, offset: 3 },
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
