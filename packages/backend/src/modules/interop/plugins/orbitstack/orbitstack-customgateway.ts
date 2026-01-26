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

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

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

// == L1 -> L2 ERC20 deposits for custom gateways ==

// L1: DepositInitiated from L1CustomGateway
const DepositInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.DepositInitiated')

const parseDepositInitiated = createEventParser(depositInitiatedLog)

// L2: DepositFinalized from L2CustomGateway
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(depositFinalizedLog)

const parseTransfer = createEventParser(transferLog)

// == L2 -> L1 ERC20 withdrawals for custom gateways ==

// L2: WithdrawalInitiated from L2CustomGateway
const WithdrawalInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.WithdrawalInitiated', {
  ttl: 30 * UnixTime.DAY,
})

const parseWithdrawalInitiated = createEventParser(withdrawalInitiatedLog)

// L1: WithdrawalFinalized from L1CustomGateway
const WithdrawalFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  amount: bigint
  gatewayKey: string
}>('orbitstack-customgateway.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(withdrawalFinalizedLog)

export class OrbitStackCustomGatewayPlugin implements InteropPluginResyncable {
  readonly name = 'orbitstack-customgateway'

  getDataRequests(): DataRequest[] {
    // Collect all custom gateway addresses across networks
    const l1Gateways: ChainSpecificAddress[] = []
    const l2Gateways: ChainSpecificAddress[] = []

    for (const network of ORBITSTACK_NETWORKS) {
      for (const gateway of network.customGateways ?? []) {
        l1Gateways.push(ChainSpecificAddress(`eth:${gateway.l1Gateway}`))
        l2Gateways.push(
          ChainSpecificAddress(`${network.chain}:${gateway.l2Gateway}`),
        )
      }
    }

    return [
      // L1: DepositInitiated from L1CustomGateway
      {
        type: 'event',
        signature: depositInitiatedLog,
        addresses: l1Gateways,
      },
      // L1: WithdrawalFinalized from L1CustomGateway
      {
        type: 'event',
        signature: withdrawalFinalizedLog,
        addresses: l1Gateways,
      },
      // L2: DepositFinalized from L2CustomGateway (with Transfer for minting)
      {
        type: 'event',
        signature: depositFinalizedLog,
        includeTxEvents: [transferLog],
        addresses: l2Gateways,
      },
      // L2: WithdrawalInitiated from L2CustomGateway (with Transfer for burning)
      {
        type: 'event',
        signature: withdrawalInitiatedLog,
        includeTxEvents: [transferLog],
        addresses: l2Gateways,
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1 operations
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

      // L1 -> L2: DepositInitiated
      const depositInitiated = parseDepositInitiated(input.log, [
        gateway.l1Gateway,
      ])
      if (depositInitiated) {
        return [
          DepositInitiated.create(input, {
            chain: network.chain,
            l1Token: Address32.from(depositInitiated._l1Token),
            amount: depositInitiated._amount,
            gatewayKey: gateway.key,
          }),
        ]
      }

      // L2 -> L1: WithdrawalFinalized
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        gateway.l1Gateway,
      ])
      if (withdrawalFinalized) {
        return [
          WithdrawalFinalized.create(input, {
            chain: network.chain,
            l1Token: Address32.from(withdrawalFinalized.l1Token),
            amount: withdrawalFinalized._amount,
            gatewayKey: gateway.key,
          }),
        ]
      }
    } else {
      // L2 operations
      const network = ORBITSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return

      const gateway = network.customGateways?.find(
        (g) => g.l2Gateway === EthereumAddress(input.log.address),
      )
      if (!gateway) return

      // L1 -> L2: DepositFinalized
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

      // L2 -> L1: WithdrawalInitiated
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        gateway.l2Gateway,
      ])
      if (withdrawalInitiated) {
        const l2Token = findBurnedTokenAddress(
          input.txLogs,
          withdrawalInitiated._from,
          withdrawalInitiated._amount,
        )
        if (!l2Token) return

        return [
          WithdrawalInitiated.create(input, {
            chain: network.chain,
            l1Token: Address32.from(withdrawalInitiated.l1Token),
            l2Token,
            amount: withdrawalInitiated._amount,
            gatewayKey: gateway.key,
          }),
        ]
      }
    }
  }

  matchTypes = [DepositFinalized, WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L2->L1 ERC20 withdrawals
    if (WithdrawalFinalized.checkType(event)) {
      // L1: OutBoxTransactionExecuted → Transfer → (optional Approval) → WithdrawalFinalized
      // Use sameTxBefore because some tokens (like GRT) emit extra events
      const outBoxTransactionExecuted = db.find(OutBoxTransactionExecuted, {
        sameTxBefore: event,
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
