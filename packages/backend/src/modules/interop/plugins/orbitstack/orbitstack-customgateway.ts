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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

// == L1 -> L2 ERC20 deposits for custom gateways ==

const DepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  l1Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.MessageDeliveredDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

// == L2 -> L1 ERC20 withdrawals for custom gateways ==

const WithdrawalInitiatedL2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  l2Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.L2ToL1TxWithdrawalInitiated', {
  ttl: 14 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address l1Token, address indexed _from, address indexed _to, uint256 indexed _l2ToL1Id, uint256 _exitNum, uint256 _amount)',
)

const WithdrawalFinalizedOutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
  l1Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(address l1Token, address indexed _from, address indexed _to, uint256 indexed _exitNum, uint256 _amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export class OrbitStackCustomGatewayPlugin implements InteropPlugin {
  readonly name = 'orbitstack-customgateway'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const network = ORBITSTACK_NETWORKS.find((network) =>
        network.customGateways?.some(
          (gateway) => gateway.l1Gateway === EthereumAddress(input.log.address),
        ),
      )
      if (!network) return

      const gateway = network.customGateways?.find(
        (g) => g.l1Gateway === EthereumAddress(input.log.address),
      )
      if (!gateway) return

      const depositInitiated = parseDepositInitiated(input.log, [
        gateway.l1Gateway,
      ])
      if (depositInitiated) {
        const messageDeliveredLog = input.txLogs.find((log) => {
          const parsed = parseMessageDelivered(log, [ChainSpecificAddress.address(network.bridge)])
          return (
            parsed !== undefined &&
            parsed.messageIndex === depositInitiated._sequenceNumber
          )
        })

        if (messageDeliveredLog) {
          const messageDelivered = parseMessageDelivered(messageDeliveredLog, [
            ChainSpecificAddress.address(network.bridge),
          ])
          if (messageDelivered) {
            return [
              DepositInitiatedMessageDelivered.create(input, {
                chain: network.chain,
                messageNum: messageDelivered.messageIndex.toString(),
                l1Token: Address32.from(depositInitiated._l1Token),
                amount: depositInitiated._amount,
                gatewayKey: gateway.key,
              }),
            ]
          }
        }
      }

      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        gateway.l1Gateway,
      ])
      if (withdrawalFinalized) {
        const outBoxTxLog = input.txLogs.find((log) => {
          const parsed = parseOutBoxTransactionExecuted(log, [ChainSpecificAddress.address(network.outbox)])
          return parsed !== undefined
        })

        if (outBoxTxLog) {
          const outBoxTx = parseOutBoxTransactionExecuted(outBoxTxLog, [
            ChainSpecificAddress.address(network.outbox),
          ])
          if (outBoxTx) {
            return [
              WithdrawalFinalizedOutBoxTransactionExecuted.create(input, {
                chain: network.chain,
                position: Number(outBoxTx.transactionIndex),
                l1Token: Address32.from(withdrawalFinalized.l1Token),
                amount: withdrawalFinalized._amount,
                gatewayKey: gateway.key,
              }),
            ]
          }
        }
      }
    } else {
      const network = ORBITSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return

      const gateway = network.customGateways?.find(
        (g) => g.l2Gateway === EthereumAddress(input.log.address),
      )
      if (!gateway) return

      const depositFinalized = parseDepositFinalized(input.log, [
        gateway.l2Gateway,
      ])
      if (depositFinalized) {
        const l2Token = findMintedTokenAddress(
          input.txLogs,
          depositFinalized.to,
          depositFinalized.amount,
        )
        if (!l2Token) return

        return [
          DepositFinalized.create(input, {
            chain: network.chain,
            l1Token: Address32.from(depositFinalized.l1Token),
            l2Token,
            amount: depositFinalized.amount,
            gatewayKey: gateway.key,
          }),
        ]
      }

      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        gateway.l2Gateway,
      ])
      if (withdrawalInitiated) {
        const l2ToL1TxLog = input.txLogs.find((log) => {
          const parsed = parseL2ToL1Tx(log, [ChainSpecificAddress.address(network.arbsys)])
          return (
            parsed !== undefined &&
            Number(parsed.position) === Number(withdrawalInitiated._l2ToL1Id)
          )
        })
        if (!l2ToL1TxLog) return

        const l2ToL1Tx = parseL2ToL1Tx(l2ToL1TxLog, [ChainSpecificAddress.address(network.arbsys)])
        if (!l2ToL1Tx) return

        const l2Token = findBurnedTokenAddress(
          input.txLogs,
          withdrawalInitiated._from,
          withdrawalInitiated._amount,
        )
        if (!l2Token) return

        return [
          WithdrawalInitiatedL2ToL1Tx.create(input, {
            chain: network.chain,
            position: Number(l2ToL1Tx.position),
            l1Token: Address32.from(withdrawalInitiated.l1Token),
            l2Token,
            amount: withdrawalInitiated._amount,
            gatewayKey: gateway.key,
          }),
        ]
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

      const appName = `orbitstack-customgateway-${event.args.gatewayKey}`
      return [
        Result.Message('orbitstack.L2ToL1Message', {
          app: appName,
          srcEvent: l2ToL1Tx,
          dstEvent: outBoxTransactionExecuted,
        }),
        Result.Transfer('orbitstack.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: withdrawalInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }

    if (DepositFinalized.checkType(event)) {
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

      const appName = `orbitstack-customgateway-${event.args.gatewayKey}`
      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: appName,
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: depositInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }
  }
}

function findMintedTokenAddress(
  logs: LogToCapture['txLogs'],
  recipient: string,
  amount: bigint,
): Address32 | undefined {
  // First, try to find a standard mint (from zero address)
  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (
      transfer &&
      transfer.from.toLowerCase() === ZERO_ADDRESS &&
      transfer.to.toLowerCase() === recipient.toLowerCase() &&
      transfer.value === amount
    ) {
      return Address32.from(log.address)
    }
  }

  // Fallback: look for any Transfer with matching recipient and amount
  // This handles custom gateways that transfer from reserves or the token contract itself
  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (
      transfer &&
      transfer.to.toLowerCase() === recipient.toLowerCase() &&
      transfer.value === amount
    ) {
      return Address32.from(log.address)
    }
  }

  return undefined
}

function findBurnedTokenAddress(
  logs: LogToCapture['txLogs'],
  sender: string,
  amount: bigint,
): Address32 | undefined {
  // First, try to find a standard burn (to zero address)
  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (
      transfer &&
      transfer.to.toLowerCase() === ZERO_ADDRESS &&
      transfer.from.toLowerCase() === sender.toLowerCase() &&
      transfer.value === amount
    ) {
      return Address32.from(log.address)
    }
  }

  // Fallback: look for any Transfer with matching sender and amount
  // This handles custom gateways that transfer to reserves or the token contract itself
  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (
      transfer &&
      transfer.from.toLowerCase() === sender.toLowerCase() &&
      transfer.value === amount
    ) {
      return Address32.from(log.address)
    }
  }

  return undefined
}
