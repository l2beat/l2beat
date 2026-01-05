import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  hashCrossDomainMessageV1,
  MessagePassed,
  OPSTACK_NETWORKS,
  parseRelayedMessage,
  parseSentMessage,
  parseSentMessageExtension1,
  parseWithdrawalFinalized,
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
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// L1 → L2: ERC20DepositInitiated from wstETH bridge + SentMessage combined
const LidoWstethDepositSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.DepositSentMessage')

// L2 relay of L1→L2 deposit: DepositFinalized from wstETH bridge + RelayedMessage combined
const LidoWstethDepositFinalized = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.DepositFinalized')

// L2 → L1: WithdrawalInitiated from wstETH bridge + MessagePassed combined
const LidoWstethWithdrawalMessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.WithdrawalMessagePassed', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20WithdrawalFinalized from wstETH bridge + WithdrawalFinalized combined
const LidoWstethWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
  l2Token: Address32
}>('lido-wsteth.WithdrawalFinalized')

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

// MessagePassed event parser (from L2ToL1MessagePasser)
const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

export class LidoWstethPlugin implements InteropPlugin {
  name = 'lido-wsteth'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      // L1: Capture ERC20DepositInitiated (L1 → L2 deposit)
      const lidoNetwork = L1_BRIDGE_TO_NETWORK.get(input.log.address)
      if (lidoNetwork) {
        const depositInitiated = parseERC20DepositInitiated(input.log, [
          lidoNetwork.l1Bridge,
        ])
        if (depositInitiated) {
          // Find SentMessage from any known L1CrossDomainMessenger in the same tx
          for (const log of input.txLogs) {
            const opNetwork = L1_CDM_TO_NETWORK.get(log.address)
            if (!opNetwork || opNetwork.chain !== lidoNetwork.chain) continue

            const sentMessage = parseSentMessage(log, [
              opNetwork.l1CrossDomainMessenger,
            ])
            if (!sentMessage) continue

            // Find SentMessageExtension1
            const nextLog = input.txLogs.find(
              // biome-ignore lint/style/noNonNullAssertion: It's there
              (x) => x.logIndex === log.logIndex! + 1,
            )
            const extension =
              nextLog &&
              parseSentMessageExtension1(nextLog, [
                opNetwork.l1CrossDomainMessenger,
              ])

            const msgHash = hashCrossDomainMessageV1(
              sentMessage.messageNonce,
              sentMessage.sender,
              sentMessage.target,
              extension?.value ?? 0n,
              sentMessage.gasLimit,
              sentMessage.message,
            )

            return [
              LidoWstethDepositSentMessage.create(input, {
                chain: lidoNetwork.chain,
                msgHash,
                amount: depositInitiated._amount,
                l2Token: lidoNetwork.l2Token,
              }),
            ]
          }
        }

        // L1: Capture ERC20WithdrawalFinalized (L2 → L1 withdrawal finalization)
        const withdrawalFinalized = parseERC20WithdrawalFinalized(input.log, [
          lidoNetwork.l1Bridge,
        ])
        if (withdrawalFinalized) {
          // Find WithdrawalFinalized event from OptimismPortal in same tx
          const opNetwork = OPSTACK_NETWORKS.find(
            (n) => n.chain === lidoNetwork.chain,
          )
          if (!opNetwork) return

          const withdrawalFinalizedLog = input.txLogs.find((log) => {
            const parsed = parseWithdrawalFinalized(log, [
              opNetwork.optimismPortal,
            ])
            return parsed !== undefined
          })

          if (withdrawalFinalizedLog) {
            const portalWithdrawalFinalized = parseWithdrawalFinalized(
              withdrawalFinalizedLog,
              [opNetwork.optimismPortal],
            )
            if (portalWithdrawalFinalized) {
              return [
                LidoWstethWithdrawalFinalized.create(input, {
                  chain: lidoNetwork.chain,
                  withdrawalHash: portalWithdrawalFinalized.withdrawalHash,
                  amount: withdrawalFinalized._amount,
                  l2Token: lidoNetwork.l2Token,
                }),
              ]
            }
          }
        }
      }
    } else {
      // L2: Check if this is a supported Lido wstETH network
      const lidoNetwork = L2_BRIDGE_TO_NETWORK.get(input.log.address)
      if (!lidoNetwork || lidoNetwork.chain !== input.chain) return

      const opNetwork = OPSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!opNetwork) return

      // L2: Capture DepositFinalized (L1 → L2 deposit relay)
      const depositFinalized = parseDepositFinalized(input.log, [
        lidoNetwork.l2Bridge,
      ])
      if (depositFinalized) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            opNetwork.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            opNetwork.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            return [
              LidoWstethDepositFinalized.create(input, {
                chain: lidoNetwork.chain,
                msgHash: relayedMessage.msgHash,
                amount: depositFinalized._amount,
                l2Token: lidoNetwork.l2Token,
              }),
            ]
          }
        }
      }

      // L2: Capture WithdrawalInitiated (L2 → L1 withdrawal)
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        lidoNetwork.l2Bridge,
      ])
      if (withdrawalInitiated) {
        // Find MessagePassed in same tx
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [
            opNetwork.l2ToL1MessagePasser,
          ])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            opNetwork.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            return [
              LidoWstethWithdrawalMessagePassed.create(input, {
                chain: lidoNetwork.chain,
                withdrawalHash: messagePassed.withdrawalHash,
                amount: withdrawalInitiated._amount,
                l2Token: lidoNetwork.l2Token,
              }),
            ]
          }
        }
      }
    }
  }

  // Match on our combined events (like standardbridge does)
  matchTypes = [LidoWstethDepositFinalized, LidoWstethWithdrawalFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L1 → L2 deposit matching
    if (LidoWstethDepositFinalized.checkType(event)) {
      const depositSentMessage = db.find(LidoWstethDepositSentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!depositSentMessage) return

      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const relayedMessage = db.find(RelayedMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!relayedMessage) return

      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'lido-wsteth',
          srcEvent: sentMessage,
          dstEvent: relayedMessage,
        }),
        Result.Transfer('lido-wsteth.L1ToL2Transfer', {
          srcEvent: depositSentMessage,
          srcAmount: depositSentMessage.args.amount,
          srcTokenAddress: L1_WSTETH,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }

    // L2 → L1 withdrawal matching
    if (LidoWstethWithdrawalFinalized.checkType(event)) {
      const withdrawalMessagePassed = db.find(
        LidoWstethWithdrawalMessagePassed,
        {
          withdrawalHash: event.args.withdrawalHash,
          chain: event.args.chain,
        },
      )
      if (!withdrawalMessagePassed) return

      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return

      const withdrawalFinalized = db.find(WithdrawalFinalized, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!withdrawalFinalized) return

      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'lido-wsteth',
          srcEvent: messagePassed,
          dstEvent: withdrawalFinalized,
        }),
        Result.Transfer('lido-wsteth.L2ToL1Transfer', {
          srcEvent: withdrawalMessagePassed,
          srcAmount: withdrawalMessagePassed.args.amount,
          srcTokenAddress: withdrawalMessagePassed.args.l2Token,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L1_WSTETH,
        }),
      ]
    }
  }
}
