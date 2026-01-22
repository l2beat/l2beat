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
  MessagePassed,
  OPSTACK_NETWORKS,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
} from './opstack'

// == Event signatures ==

const erc20BridgeInitiatedLog =
  'event ERC20BridgeInitiated(address indexed l2Token, address indexed l1Token, address indexed from, address to, uint256 amount, bytes extraData)'
const erc20BridgeFinalizedLog =
  'event ERC20BridgeFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)'
const erc20DepositInitiatedLog =
  'event ERC20DepositInitiated(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)'
const depositFinalizedLog =
  'event DepositFinalized(address indexed l1Token, address indexed l2Token, address indexed from, address to, uint256 amount, bytes extraData)'
const ethBridgeInitiatedLog =
  'event ETHBridgeInitiated(address indexed from, address indexed to, uint256 amount, bytes extraData)'
const ethBridgeFinalizedLog =
  'event ETHBridgeFinalized(address indexed from, address indexed to, uint256 amount, bytes extraData)'

// ============= L2 -> L1 Events =============

// L2: ERC20 withdrawal initiated
const ERC20BridgeInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.ERC20BridgeInitiated', {
  ttl: 14 * UnixTime.DAY,
})

const parseERC20BridgeInitiated = createEventParser(erc20BridgeInitiatedLog)

// L1: ERC20 withdrawal finalized
const ERC20BridgeFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.ERC20BridgeFinalized')

const parseERC20BridgeFinalized = createEventParser(erc20BridgeFinalizedLog)

// L2: ETH withdrawal initiated
const ETHBridgeInitiatedL2 = createInteropEventType<{
  chain: string
  amount: bigint
}>('opstack.ETHBridgeInitiatedL2', {
  ttl: 14 * UnixTime.DAY,
})

// L1: ETH withdrawal finalized
const ETHBridgeFinalizedL1 = createInteropEventType<{
  chain: string
  amount: bigint
}>('opstack.ETHBridgeFinalizedL1')

// ============= L1 -> L2 Events =============

// L1: ERC20 deposit initiated
const ERC20DepositInitiated = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.ERC20DepositInitiated')

const parseERC20DepositInitiated = createEventParser(erc20DepositInitiatedLog)

// L2: ERC20 deposit finalized (legacy event, also emitted for ETH)
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: bigint
}>('opstack.DepositFinalized')

const parseDepositFinalized = createEventParser(depositFinalizedLog)

// L1: ETH deposit initiated
const ETHBridgeInitiatedL1 = createInteropEventType<{
  chain: string
  amount: bigint
}>('opstack.ETHBridgeInitiatedL1')

const parseETHBridgeInitiated = createEventParser(ethBridgeInitiatedLog)

// L2: ETH deposit finalized
const ETHBridgeFinalizedL2 = createInteropEventType<{
  chain: string
  amount: bigint
}>('opstack.ETHBridgeFinalizedL2')

const parseETHBridgeFinalized = createEventParser(ethBridgeFinalizedLog)

export class OpStackStandardBridgePlugin implements InteropPluginResyncable {
  readonly name = 'opstack-standardbridge'

  getDataRequests(): DataRequest[] {
    return [
      // L2: ERC20BridgeInitiated, ETHBridgeInitiated from L2StandardBridge
      {
        type: 'event',
        signature: erc20BridgeInitiatedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2StandardBridge),
      },
      {
        type: 'event',
        signature: ethBridgeInitiatedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2StandardBridge),
      },
      // L2: DepositFinalized, ETHBridgeFinalized from L2StandardBridge
      {
        type: 'event',
        signature: depositFinalizedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2StandardBridge),
      },
      {
        type: 'event',
        signature: ethBridgeFinalizedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2StandardBridge),
      },
      // L1: ERC20BridgeFinalized, ETHBridgeFinalized from L1StandardBridge
      {
        type: 'event',
        signature: erc20BridgeFinalizedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l1StandardBridge),
      },
      {
        type: 'event',
        signature: ethBridgeFinalizedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l1StandardBridge),
      },
      // L1: ERC20DepositInitiated, ETHBridgeInitiated from L1StandardBridge
      {
        type: 'event',
        signature: erc20DepositInitiatedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l1StandardBridge),
      },
      {
        type: 'event',
        signature: ethBridgeInitiatedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l1StandardBridge),
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain !== 'ethereum') {
      // L2 side
      const network = OPSTACK_NETWORKS.find((x) => x.chain === input.chain)
      if (!network) return
      const l2StandardBridge = ChainSpecificAddress.address(
        network.l2StandardBridge,
      )

      // L2 -> L1: ERC20 withdrawal initiated
      const erc20BridgeInitiated = parseERC20BridgeInitiated(input.log, [
        l2StandardBridge,
      ])
      if (erc20BridgeInitiated) {
        return [
          ERC20BridgeInitiated.create(input, {
            chain: network.chain,
            l1Token: Address32.from(erc20BridgeInitiated.l1Token),
            l2Token: Address32.from(erc20BridgeInitiated.l2Token),
            amount: erc20BridgeInitiated.amount,
          }),
        ]
      }

      // L2 -> L1: ETH withdrawal initiated
      const ethBridgeInitiatedL2 = parseETHBridgeInitiated(input.log, [
        l2StandardBridge,
      ])
      if (ethBridgeInitiatedL2) {
        return [
          ETHBridgeInitiatedL2.create(input, {
            chain: network.chain,
            amount: ethBridgeInitiatedL2.amount,
          }),
        ]
      }

      // L1 -> L2: ERC20/ETH deposit finalized (legacy event)
      const depositFinalized = parseDepositFinalized(input.log, [
        l2StandardBridge,
      ])
      if (depositFinalized) {
        return [
          DepositFinalized.create(input, {
            chain: network.chain,
            l1Token: Address32.from(depositFinalized.l1Token),
            l2Token: Address32.from(depositFinalized.l2Token),
            amount: depositFinalized.amount,
          }),
        ]
      }

      // L1 -> L2: ETH deposit finalized
      const ethBridgeFinalizedL2 = parseETHBridgeFinalized(input.log, [
        l2StandardBridge,
      ])
      if (ethBridgeFinalizedL2) {
        return [
          ETHBridgeFinalizedL2.create(input, {
            chain: network.chain,
            amount: ethBridgeFinalizedL2.amount,
          }),
        ]
      }
    } else {
      // L1 side
      const logAddress = EthereumAddress(input.log.address)
      const network = OPSTACK_NETWORKS.find(
        (n) => ChainSpecificAddress.address(n.l1StandardBridge) === logAddress,
      )
      if (!network) return
      const l1StandardBridge = ChainSpecificAddress.address(
        network.l1StandardBridge,
      )

      // L2 -> L1: ERC20 withdrawal finalized
      const erc20BridgeFinalized = parseERC20BridgeFinalized(input.log, [
        l1StandardBridge,
      ])
      if (erc20BridgeFinalized) {
        return [
          ERC20BridgeFinalized.create(input, {
            chain: network.chain,
            l1Token: Address32.from(erc20BridgeFinalized.l1Token),
            l2Token: Address32.from(erc20BridgeFinalized.l2Token),
            amount: erc20BridgeFinalized.amount,
          }),
        ]
      }

      // L2 -> L1: ETH withdrawal finalized
      const ethBridgeFinalizedL1 = parseETHBridgeFinalized(input.log, [
        l1StandardBridge,
      ])
      if (ethBridgeFinalizedL1) {
        return [
          ETHBridgeFinalizedL1.create(input, {
            chain: network.chain,
            amount: ethBridgeFinalizedL1.amount,
          }),
        ]
      }

      // L1 -> L2: ERC20 deposit initiated
      const erc20DepositInitiated = parseERC20DepositInitiated(input.log, [
        l1StandardBridge,
      ])
      if (erc20DepositInitiated) {
        return [
          ERC20DepositInitiated.create(input, {
            chain: network.chain,
            l1Token: Address32.from(erc20DepositInitiated.l1Token),
            l2Token: Address32.from(erc20DepositInitiated.l2Token),
            amount: erc20DepositInitiated.amount,
          }),
        ]
      }

      // L1 -> L2: ETH deposit initiated
      const ethBridgeInitiatedL1 = parseETHBridgeInitiated(input.log, [
        l1StandardBridge,
      ])
      if (ethBridgeInitiatedL1) {
        return [
          ETHBridgeInitiatedL1.create(input, {
            chain: network.chain,
            amount: ethBridgeInitiatedL1.amount,
          }),
        ]
      }
    }
  }

  matchTypes = [
    // L2 -> L1: trigger on L1 finalization events
    ERC20BridgeFinalized,
    ETHBridgeFinalizedL1,
    // L1 -> L2: trigger on L2 finalization events
    ETHBridgeFinalizedL2,
    DepositFinalized,
  ]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (ERC20BridgeFinalized.checkType(event)) {
      // L1: ERC20BridgeFinalized (N) → ERC20WithdrawalFinalized (N+1) → RelayedMessage (N+2) → WithdrawalFinalized (N+3)
      // L1: ERC20BridgeFinalized (N) → RelayedMessage (N+1) → WithdrawalFinalized (N+2)
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAtOffset: { event, offset: 2 },
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      // L2: ERC20BridgeInitiated (N) → MessagePassed (N+1)
      const erc20BridgeInitiated = db.find(ERC20BridgeInitiated, {
        sameTxAtOffset: { event: messagePassed, offset: -1 },
        chain: event.args.chain,
      })
      if (!erc20BridgeInitiated) return

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

    if (ETHBridgeFinalizedL1.checkType(event)) {
      // L1: ETHBridgeFinalizedL1 (N) → RelayedMessage (N+1) → WithdrawalFinalized (N+2)
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAtOffset: { event, offset: 2 },
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      // L2: ETHBridgeInitiatedL2 (N) → MessagePassed (N+1)
      const ethBridgeInitiated = db.find(ETHBridgeInitiatedL2, {
        sameTxAtOffset: { event: messagePassed, offset: -1 },
        chain: event.args.chain,
      })
      if (!ethBridgeInitiated) return

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

    if (ETHBridgeFinalizedL2.checkType(event)) {
      // L2: ETHBridgeFinalizedL2 (N) → RelayedMessage (N+1)
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 1 },
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // L1: ETHBridgeInitiatedL1 → ... → SentMessage (offset varies: -2 for Base, -3 for Optimism due to ETHLocked)
      const ethBridgeInitiated = db.find(ETHBridgeInitiatedL1, {
        sameTxBefore: sentMessage,
        chain: event.args.chain,
      })
      if (!ethBridgeInitiated) return

      // L2: DepositFinalized (N) → ETHBridgeFinalizedL2 (N+1) → RelayedMessage (N+2)
      const depositFinalized = db.find(DepositFinalized, {
        sameTxAtOffset: { event: relayedMessage, offset: -2 },
        chain: event.args.chain,
      })

      const extraEvents: InteropEvent[] = []
      if (depositFinalized) {
        extraEvents.push(depositFinalized)
      }

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'opstack-standardbridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents,
        }),
        Result.Transfer('opstack-standardbridge.L1ToL2Transfer', {
          srcEvent: ethBridgeInitiated,
          srcAmount: ethBridgeInitiated.args.amount,
          srcTokenAddress: Address32.NATIVE,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: Address32.NATIVE,
          extraEvents,
        }),
      ]
    }

    if (DepositFinalized.checkType(event)) {
      // L2: DepositFinalized (N) → ERC20BridgeFinalized (N+1) → RelayedMessage (N+2)
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 2 },
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // L1: ERC20DepositInitiated (N) → ERC20BridgeInitiated (N+1) → TransactionDeposited (N+2) → SentMessage (N+3)
      const erc20DepositInitiated = db.find(ERC20DepositInitiated, {
        sameTxAtOffset: { event: sentMessage, offset: -3 },
        chain: event.args.chain,
      })
      // If not found, this might be an ETH deposit (DepositFinalized is also emitted for ETH)
      // In that case, the ETHBridgeFinalizedL2 handler should match it
      if (!erc20DepositInitiated) return

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
  }
}
