import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  MessagePassed,
  RelayedMessage,
  SentMessage,
  WithdrawalFinalized,
} from './opstack/opstack'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// Token addresses
const L1_WSTETH = Address32.from(
  EthereumAddress('0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'),
)

// Lido wstETH bridge configurations per network
const LIDO_WSTETH_NETWORKS = [
  {
    chain: 'base',
    l1Bridge: EthereumAddress('0x9de443AdC5A411E83F1878Ef24C3F52C61571e72'),
    l2Bridge: EthereumAddress('0xac9D11cD4D7eF6e54F14643a393F68Ca014287AB'),
    l2Token: Address32.from(
      EthereumAddress('0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452'),
    ),
  },
  {
    chain: 'optimism',
    l1Bridge: EthereumAddress('0x76943c0d61395d8f2edf9060e1533529cae05de6'),
    l2Bridge: EthereumAddress('0x8E01013243a96601a86eb3153F0d9Fa4fbFb6957'),
    l2Token: Address32.from(
      EthereumAddress('0x1F32b1c2345538c0c6f582fCB022739c4A194Ebb'),
    ),
  },
]

// Build lookup maps
const L1_BRIDGE_TO_NETWORK = new Map(
  LIDO_WSTETH_NETWORKS.map((n) => [n.l1Bridge.toString(), n]),
)
const L2_BRIDGE_TO_NETWORK = new Map(
  LIDO_WSTETH_NETWORKS.map((n) => [n.l2Bridge.toString(), n]),
)

// L1 → L2: ERC20DepositInitiated from wstETH bridge
const DepositInitiated = createInteropEventType<{
  chain: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.DepositInitiated')

// L2 relay of L1→L2 deposit: DepositFinalized from wstETH bridge
const DepositFinalized = createInteropEventType<{
  chain: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.DepositFinalized')

// L2 → L1: WithdrawalInitiated from wstETH bridge
const WithdrawalInitiated = createInteropEventType<{
  chain: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.WithdrawalInitiated', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20WithdrawalFinalized from wstETH bridge
const ERC20WithdrawalFinalized = createInteropEventType<{
  chain: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.ERC20WithdrawalFinalized')

// Event parsers
const parseERC20DepositInitiated = createEventParser(
  'event ERC20DepositInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseWithdrawalInitiated = createEventParser(
  'event WithdrawalInitiated(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

const parseERC20WithdrawalFinalized = createEventParser(
  'event ERC20WithdrawalFinalized(address indexed _l1Token, address indexed _l2Token, address indexed _from, address _to, uint256 _amount, bytes _data)',
)

export class LidoWstethPlugin implements InteropPlugin {
  readonly name = 'lido-wsteth'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const lidoNetwork = L1_BRIDGE_TO_NETWORK.get(input.log.address)
      if (!lidoNetwork) return

      // L1: Capture ERC20DepositInitiated (L1 → L2 deposit)
      const depositInitiated = parseERC20DepositInitiated(input.log, [
        lidoNetwork.l1Bridge,
      ])
      if (depositInitiated) {
        return [
          DepositInitiated.create(input, {
            chain: lidoNetwork.chain,
            amount: depositInitiated._amount,
            l2Token: lidoNetwork.l2Token,
          }),
        ]
      }

      // L1: Capture ERC20WithdrawalFinalized (L2 → L1 withdrawal finalization)
      const withdrawalFinalized = parseERC20WithdrawalFinalized(input.log, [
        lidoNetwork.l1Bridge,
      ])
      if (withdrawalFinalized) {
        return [
          ERC20WithdrawalFinalized.create(input, {
            chain: lidoNetwork.chain,
            amount: withdrawalFinalized._amount,
            l2Token: lidoNetwork.l2Token,
          }),
        ]
      }
    } else {
      // L2: Check if this is a supported Lido wstETH network
      const lidoNetwork = L2_BRIDGE_TO_NETWORK.get(input.log.address)
      if (!lidoNetwork || lidoNetwork.chain !== input.chain) return

      // L2: Capture DepositFinalized (L1 → L2 deposit relay)
      const depositFinalized = parseDepositFinalized(input.log, [
        lidoNetwork.l2Bridge,
      ])
      if (depositFinalized) {
        return [
          DepositFinalized.create(input, {
            chain: lidoNetwork.chain,
            amount: depositFinalized._amount,
            l2Token: lidoNetwork.l2Token,
          }),
        ]
      }

      // L2: Capture WithdrawalInitiated (L2 → L1 withdrawal)
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        lidoNetwork.l2Bridge,
      ])
      if (withdrawalInitiated) {
        return [
          WithdrawalInitiated.create(input, {
            chain: lidoNetwork.chain,
            amount: withdrawalInitiated._amount,
            l2Token: lidoNetwork.l2Token,
          }),
        ]
      }
    }
  }

  matchTypes = [DepositFinalized, ERC20WithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (DepositFinalized.checkType(event)) {
      // L2: DepositFinalized → RelayedMessage
      const relayedMessage = db.find(RelayedMessage, {
        sameTxAfter: event,
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      // L1: Find SentMessage by msgHash
      const sentMessage = db.find(SentMessage, {
        msgHash: relayedMessage.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      // L1: SentMessage → DepositInitiated
      const depositInitiated = db.find(DepositInitiated, {
        sameTxAfter: sentMessage,
        chain: event.args.chain,
      })
      if (!depositInitiated) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'lido-wsteth',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
          extraEvents: [depositInitiated, event],
        }),
        Result.Transfer('lido-wsteth.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: depositInitiated.args.amount,
          srcTokenAddress: L1_WSTETH,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (ERC20WithdrawalFinalized.checkType(event)) {
      // L1: ERC20WithdrawalFinalized → WithdrawalFinalized
      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        sameTxAfter: event,
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      // L2: Find MessagePassed by withdrawalHash
      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: withdrawalFinalized.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      // L2: MessagePassed → WithdrawalInitiated
      const withdrawalInitiated = db.find(WithdrawalInitiated, {
        sameTxAfter: messagePassed,
        chain: event.args.chain,
      })
      if (!withdrawalInitiated) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'lido-wsteth',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
          extraEvents: [withdrawalInitiated, event],
        }),
        Result.Transfer('lido-wsteth.L2ToL1Transfer', {
          srcEvent: withdrawalInitiated,
          srcAmount: withdrawalInitiated.args.amount,
          srcTokenAddress: withdrawalInitiated.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L1_WSTETH,
        }),
      ]
    }
  }
}
