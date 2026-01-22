import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
import {
  MessagePassed,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
} from './opstack/opstack'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// == Event signatures ==

const erc20DepositInitiatedLog =
  'event ERC20DepositInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)'
const depositFinalizedLog =
  'event DepositFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)'
const withdrawalInitiatedLog =
  'event WithdrawalInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)'
const erc20WithdrawalFinalizedLog =
  'event ERC20WithdrawalFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)'

interface MakerBridgeNetwork {
  chain: string
  l1Bridge: ChainSpecificAddress
  l2Bridge: ChainSpecificAddress
}

// Maker bridge configurations (Optimism only, supports DAI, USDS, and sUSDS tokens)
const MAKER_BRIDGE_NETWORKS = defineNetworks<MakerBridgeNetwork>(
  'maker-bridge',
  [
    {
      chain: 'optimism',
      l1Bridge: ChainSpecificAddress(
        'eth:0x10E6593CDda8c58a1d0f14C5164B376352a55f2F',
      ),
      l2Bridge: ChainSpecificAddress(
        'oeth:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
      ),
    },
  ],
)

// Build lookup maps
const L1_BRIDGE_TO_NETWORK = new Map(
  MAKER_BRIDGE_NETWORKS.map((n) => [
    ChainSpecificAddress.address(n.l1Bridge).toString(),
    n,
  ]),
)
const L2_BRIDGE_TO_NETWORK = new Map(
  MAKER_BRIDGE_NETWORKS.map((n) => [
    ChainSpecificAddress.address(n.l2Bridge).toString(),
    n,
  ]),
)

// L1 → L2: ERC20DepositInitiated from Maker bridge
const DepositInitiated = createInteropEventType<{
  chain: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.DepositInitiated')

// L2 relay of L1→L2 deposit: DepositFinalized from Maker bridge
const DepositFinalized = createInteropEventType<{
  chain: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.DepositFinalized')

// L2 → L1: WithdrawalInitiated from Maker bridge
const WithdrawalInitiated = createInteropEventType<{
  chain: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.WithdrawalInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20WithdrawalFinalized from Maker bridge
const ERC20WithdrawalFinalized = createInteropEventType<{
  chain: string
  amount: bigint
  l1Token: Address32
  l2Token: Address32
}>('maker-bridge.ERC20WithdrawalFinalized')

// Event parsers
const parseERC20DepositInitiated = createEventParser(erc20DepositInitiatedLog)
const parseDepositFinalized = createEventParser(depositFinalizedLog)
const parseWithdrawalInitiated = createEventParser(withdrawalInitiatedLog)
const parseERC20WithdrawalFinalized = createEventParser(
  erc20WithdrawalFinalizedLog,
)

export class MakerBridgePlugin implements InteropPluginResyncable {
  readonly name = 'maker-bridge'

  getDataRequests(): DataRequest[] {
    return [
      // L1: ERC20DepositInitiated, ERC20WithdrawalFinalized from l1Bridge
      {
        type: 'event',
        signature: erc20DepositInitiatedLog,
        addresses: MAKER_BRIDGE_NETWORKS.map((n) => n.l1Bridge),
      },
      {
        type: 'event',
        signature: erc20WithdrawalFinalizedLog,
        addresses: MAKER_BRIDGE_NETWORKS.map((n) => n.l1Bridge),
      },
      // L2: DepositFinalized, WithdrawalInitiated from l2Bridge
      {
        type: 'event',
        signature: depositFinalizedLog,
        addresses: MAKER_BRIDGE_NETWORKS.map((n) => n.l2Bridge),
      },
      {
        type: 'event',
        signature: withdrawalInitiatedLog,
        addresses: MAKER_BRIDGE_NETWORKS.map((n) => n.l2Bridge),
      },
    ]
  }

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const makerNetwork = L1_BRIDGE_TO_NETWORK.get(input.log.address)
      if (!makerNetwork) return

      // L1: Capture ERC20DepositInitiated (L1 → L2 deposit)
      const depositInitiated = parseERC20DepositInitiated(input.log, [
        ChainSpecificAddress.address(makerNetwork.l1Bridge),
      ])
      if (depositInitiated) {
        return [
          DepositInitiated.create(input, {
            chain: makerNetwork.chain,
            amount: depositInitiated._amount,
            l1Token: Address32.from(
              EthereumAddress(depositInitiated._l1Token),
            ),
            l2Token: Address32.from(
              EthereumAddress(depositInitiated._l2Token),
            ),
          }),
        ]
      }

      // L1: Capture ERC20WithdrawalFinalized (L2 → L1 withdrawal finalization)
      const withdrawalFinalized = parseERC20WithdrawalFinalized(input.log, [
        ChainSpecificAddress.address(makerNetwork.l1Bridge),
      ])
      if (withdrawalFinalized) {
        return [
          ERC20WithdrawalFinalized.create(input, {
            chain: makerNetwork.chain,
            amount: withdrawalFinalized._amount,
            l1Token: Address32.from(
              EthereumAddress(withdrawalFinalized._l1Token),
            ),
            l2Token: Address32.from(
              EthereumAddress(withdrawalFinalized._l2Token),
            ),
          }),
        ]
      }
    } else {
      // L2: Check if this is a supported Maker bridge network
      const makerNetwork = L2_BRIDGE_TO_NETWORK.get(input.log.address)
      if (!makerNetwork || makerNetwork.chain !== input.chain) return

      // L2: Capture DepositFinalized (L1 → L2 deposit relay)
      const depositFinalized = parseDepositFinalized(input.log, [
        ChainSpecificAddress.address(makerNetwork.l2Bridge),
      ])
      if (depositFinalized) {
        return [
          DepositFinalized.create(input, {
            chain: makerNetwork.chain,
            amount: depositFinalized._amount,
            l1Token: Address32.from(
              EthereumAddress(depositFinalized._l1Token),
            ),
            l2Token: Address32.from(
              EthereumAddress(depositFinalized._l2Token),
            ),
          }),
        ]
      }

      // L2: Capture WithdrawalInitiated (L2 → L1 withdrawal)
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        ChainSpecificAddress.address(makerNetwork.l2Bridge),
      ])
      if (withdrawalInitiated) {
        return [
          WithdrawalInitiated.create(input, {
            chain: makerNetwork.chain,
            amount: withdrawalInitiated._amount,
            l1Token: Address32.from(
              EthereumAddress(withdrawalInitiated._l1Token),
            ),
            l2Token: Address32.from(
              EthereumAddress(withdrawalInitiated._l2Token),
            ),
          }),
        ]
      }
    }
  }

  matchTypes = [DepositFinalized, ERC20WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (DepositFinalized.checkType(event)) {
      // L2: DepositFinalized → RelayedMessage (offset +1)
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAtOffset: { event, offset: 1 },
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // L1: SentMessage (N) → SentMessageExtension1 (N+1) → DepositInitiated (N+2)
      const depositInitiated = db.find(DepositInitiated, {
        sameTxAtOffset: { event: sentMessage, offset: 2 },
        chain: event.args.chain,
      })
      if (!depositInitiated) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'maker-bridge',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [depositInitiated, event],
        }),
        Result.Transfer('maker-bridge.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: depositInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (ERC20WithdrawalFinalized.checkType(event)) {
      // L1: ERC20WithdrawalFinalized (N) → RelayedMessage (N+1) → WithdrawalFinalized (N+2)
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAtOffset: { event, offset: 2 },
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      // L2: Find MessagePassed by withdrawalHash
      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      // L2: MessagePassed (N) → SentMessage (N+1) → SentMessageExtension1 (N+2) → WithdrawalInitiated (N+3)
      const withdrawalInitiated = db.find(WithdrawalInitiated, {
        sameTxAtOffset: { event: messagePassed, offset: 3 },
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'maker-bridge',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
          extraEvents: [withdrawalInitiated, event],
        }),
        Result.Transfer('maker-bridge.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: withdrawalInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l1Token,
        }),
      ]
    }
  }
}
