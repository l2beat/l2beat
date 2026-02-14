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
  parseL2ToL1Tx,
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
const l2ToL1TxLog =
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)'

// == L1 -> L2 WETH deposits ==

// L1: DepositInitiated from L1WethGateway
const DepositInitiated = createInteropEventType<{
  chain: string
  amount: bigint
}>('orbitstack-wethgateway.DepositInitiated')

const parseDepositInitiated = createEventParser(depositInitiatedLog)

// L2: DepositFinalized from L2WethGateway
const DepositFinalized = createInteropEventType<{
  chain: string
  amount: bigint
}>('orbitstack-wethgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(depositFinalizedLog)

const parseTransfer = createEventParser(transferLog)

// == L2 -> L1 WETH withdrawals ==

// L2: WithdrawalInitiated from L2WethGateway
const WithdrawalInitiated = createInteropEventType<{
  chain: string
  amount: bigint
}>('orbitstack-wethgateway.WithdrawalInitiated', {
  ttl: 30 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(withdrawalInitiatedLog)

// L1: WithdrawalFinalized from L1WethGateway
const WithdrawalFinalized = createInteropEventType<{
  chain: string
  amount: bigint
}>('orbitstack-wethgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(withdrawalFinalizedLog)

export class OrbitStackWethGatewayPlugin implements InteropPluginResyncable {
  readonly name = 'orbitstack-wethgateway'

  getDataRequests(): DataRequest[] {
    return [
      // L1: DepositInitiated from L1WethGateway
      {
        type: 'event',
        signature: depositInitiatedLog,
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l1WethGateway),
      },
      // L1: WithdrawalFinalized from L1WethGateway
      {
        type: 'event',
        signature: withdrawalFinalizedLog,
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l1WethGateway),
      },
      // L2: DepositFinalized from L2WethGateway (with Transfer for minting verification)
      {
        type: 'event',
        signature: depositFinalizedLog,
        includeTxEvents: [transferLog],
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l2WethGateway),
      },
      // L2: WithdrawalInitiated from L2WethGateway (with Transfer for burning verification)
      {
        type: 'event',
        signature: withdrawalInitiatedLog,
        includeTxEvents: [transferLog],
        addresses: ORBITSTACK_NETWORKS.map((n) => n.l2WethGateway),
      },
      // L2: L2ToL1Tx from ArbSys (to intercept WETH withdrawals before base plugin)
      {
        type: 'event',
        signature: l2ToL1TxLog,
        includeTxEvents: [withdrawalInitiatedLog],
        addresses: ORBITSTACK_NETWORKS.map((n) => n.arbsys),
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1 operations
      const logAddress = EthereumAddress(input.log.address)
      const network = ORBITSTACK_NETWORKS.find(
        (n) => ChainSpecificAddress.address(n.l1WethGateway) === logAddress,
      )
      if (!network) return

      // L1 -> L2: DepositInitiated
      const depositInitiated = parseDepositInitiated(input.log, [
        ChainSpecificAddress.address(network.l1WethGateway),
      ])
      if (depositInitiated) {
        // Verify this is for WETH
        if (EthereumAddress(depositInitiated._l1Token) !== network.l1Weth) {
          return
        }
        return [
          DepositInitiated.create(input, {
            chain: network.chain,
            amount: depositInitiated._amount,
          }),
        ]
      }

      // L2 -> L1: WithdrawalFinalized
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        ChainSpecificAddress.address(network.l1WethGateway),
      ])
      if (withdrawalFinalized) {
        // Verify this is for WETH
        if (EthereumAddress(withdrawalFinalized.l1Token) !== network.l1Weth) {
          return
        }
        return [
          WithdrawalFinalized.create(input, {
            chain: network.chain,
            amount: withdrawalFinalized._amount,
          }),
        ]
      }
    } else {
      // L2 operations
      const network = ORBITSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return

      // First, check if this is an L2ToL1Tx event from ArbSys (for WETH withdrawals)
      // This needs to run BEFORE the base plugin to prevent misclassification
      const l2ToL1Tx = parseL2ToL1Tx(input.log, [
        ChainSpecificAddress.address(network.arbsys),
      ])
      if (l2ToL1Tx) {
        // Check if this L2ToL1Tx is part of a WETH withdrawal
        // by looking for a WithdrawalInitiated event in the same transaction
        const wethWithdrawalLog = input.txLogs.find((log) => {
          if (
            EthereumAddress(log.address) !==
            ChainSpecificAddress.address(network.l2WethGateway)
          ) {
            return false
          }
          const parsed = parseWithdrawalInitiated(log, [
            ChainSpecificAddress.address(network.l2WethGateway),
          ])
          return (
            parsed !== undefined &&
            EthereumAddress(parsed.l1Token) === network.l1Weth &&
            Number(parsed._l2ToL1Id) === Number(l2ToL1Tx.position)
          )
        })

        if (wethWithdrawalLog) {
          // This is a WETH withdrawal! Capture it to prevent base plugin from seeing it
          // Note: no ETH amount for WETH withdrawals as the value is in the token transfer
          return [
            L2ToL1Tx.create(input, {
              chain: network.chain,
              position: Number(l2ToL1Tx.position),
            }),
          ]
        }
      }

      // Check if this is from the L2 WETH gateway
      if (
        EthereumAddress(input.log.address) !==
        ChainSpecificAddress.address(network.l2WethGateway)
      )
        return

      // L1 -> L2: DepositFinalized
      const depositFinalized = parseDepositFinalized(input.log, [
        ChainSpecificAddress.address(network.l2WethGateway),
      ])
      if (depositFinalized) {
        // Verify this is for WETH
        if (EthereumAddress(depositFinalized.l1Token) !== network.l1Weth) {
          return
        }

        // Find the Transfer event (minting) in the same transaction to verify L2 WETH
        const transferLogFound = input.txLogs.find((log) => {
          if (EthereumAddress(log.address) !== network.l2Weth) {
            return false
          }
          const parsed = parseTransfer(log, [network.l2Weth])
          // Look for mint (from == 0x0 or from == gateway) to the recipient
          return (
            parsed !== undefined &&
            (parsed.from === '0x0000000000000000000000000000000000000000' ||
              EthereumAddress(parsed.from) ===
                ChainSpecificAddress.address(network.l2WethGateway)) &&
            parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
          )
        })

        if (transferLogFound) {
          return [
            DepositFinalized.create(input, {
              chain: network.chain,
              amount: depositFinalized.amount,
            }),
          ]
        }
      }

      // L2 -> L1: WithdrawalInitiated
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        ChainSpecificAddress.address(network.l2WethGateway),
      ])
      if (withdrawalInitiated) {
        // Verify this is for WETH
        if (EthereumAddress(withdrawalInitiated.l1Token) !== network.l1Weth) {
          return
        }

        // Find the Transfer event (burning) to verify L2 WETH
        const transferLogFound = input.txLogs.find((log) => {
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

        if (!transferLogFound) return

        return [
          WithdrawalInitiated.create(input, {
            chain: network.chain,
            amount: withdrawalInitiated._amount,
          }),
        ]
      }
    }
  }

  matchTypes = [DepositFinalized, WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L1->L2 WETH deposits
    if (DepositFinalized.checkType(event)) {
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

      // L1: MessageDelivered (N) → InboxMessageDelivered (N+1) → TxToL2 (N+2) → DepositInitiated (N+3)
      const depositInitiated = db.find(DepositInitiated, {
        sameTxAtOffset: { event: messageDelivered, offset: 3 },
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
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: Address32.from(network.l1Weth),
          srcWasBurned: false,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.from(network.l2Weth),
          dstWasMinted: true,
        }),
      ]
    }

    // Match L2->L1 WETH withdrawals
    if (WithdrawalFinalized.checkType(event)) {
      // L1: OutBoxTransactionExecuted → Deposit (WETH wrap) → Transfer → WithdrawalFinalized
      // Use sameTxBefore because WETH wrapping adds extra events
      const outBoxTransactionExecuted = db.find(OutBoxTransactionExecuted, {
        sameTxBefore: event,
        chain: event.args.chain,
      })
      if (!outBoxTransactionExecuted) return

      // L2: Find L2ToL1Tx by position (we capture this ourselves before base plugin)
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
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: Address32.from(network.l2Weth),
          srcWasBurned: true,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.from(network.l1Weth),
          dstWasMinted: false,
        }),
      ]
    }
  }
}
