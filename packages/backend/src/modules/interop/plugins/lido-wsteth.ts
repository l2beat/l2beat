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

// Lido wstETH bridges
const WSTETH_L1_BRIDGE_BASE = EthereumAddress(
  '0x9de443AdC5A411E83F1878Ef24C3F52C61571e72',
)
const WSTETH_L2_BRIDGE_BASE = EthereumAddress(
  '0xac9D11cD4D7eF6e54F14643a393F68Ca014287AB',
)

// Token addresses
const L1_WSTETH = Address32.from(
  EthereumAddress('0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0'),
)
const L2_WSTETH_BASE = Address32.from(
  EthereumAddress('0xc1CBa3fCea344f92D9239c08C0568f6F2F0ee452'),
)

// Build lookup map from L1CrossDomainMessenger address to network
const L1_CDM_TO_NETWORK = new Map(
  OPSTACK_NETWORKS.map((n) => [n.l1CrossDomainMessenger.toString(), n]),
)

// L1 → L2: ERC20DepositInitiated from wstETH bridge + SentMessage combined
const LidoWstethDepositSentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
}>('lido-wsteth.DepositSentMessage')

// L2 relay of L1→L2 deposit: DepositFinalized from wstETH bridge + RelayedMessage combined
const LidoWstethDepositFinalized = createInteropEventType<{
  chain: string
  msgHash: string
  amount: bigint
}>('lido-wsteth.DepositFinalized')

// L2 → L1: WithdrawalInitiated from wstETH bridge + MessagePassed combined
const LidoWstethWithdrawalMessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
}>('lido-wsteth.WithdrawalMessagePassed', {
  ttl: 14 * UnixTime.DAY,
})

// L1 finalization: ERC20WithdrawalFinalized from wstETH bridge + WithdrawalFinalized combined
const LidoWstethWithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
  amount: bigint
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
      const depositInitiated = parseERC20DepositInitiated(input.log, [
        WSTETH_L1_BRIDGE_BASE,
      ])
      if (depositInitiated) {
        // Find SentMessage from any known L1CrossDomainMessenger in the same tx
        for (const log of input.txLogs) {
          const network = L1_CDM_TO_NETWORK.get(log.address)
          if (!network) continue

          const sentMessage = parseSentMessage(log, [
            network.l1CrossDomainMessenger,
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
              network.l1CrossDomainMessenger,
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
              chain: network.chain,
              msgHash,
              amount: depositInitiated._amount,
            }),
          ]
        }
      }

      // L1: Capture ERC20WithdrawalFinalized (L2 → L1 withdrawal finalization)
      const withdrawalFinalized = parseERC20WithdrawalFinalized(input.log, [
        WSTETH_L1_BRIDGE_BASE,
      ])
      if (withdrawalFinalized) {
        // Find WithdrawalFinalized event from OptimismPortal in same tx
        const network = OPSTACK_NETWORKS.find((n) => n.chain === 'base')
        if (!network) return

        const withdrawalFinalizedLog = input.txLogs.find((log) => {
          const parsed = parseWithdrawalFinalized(log, [network.optimismPortal])
          return parsed !== undefined
        })

        if (withdrawalFinalizedLog) {
          const portalWithdrawalFinalized = parseWithdrawalFinalized(
            withdrawalFinalizedLog,
            [network.optimismPortal],
          )
          if (portalWithdrawalFinalized) {
            return [
              LidoWstethWithdrawalFinalized.create(input, {
                chain: 'base',
                withdrawalHash: portalWithdrawalFinalized.withdrawalHash,
                amount: withdrawalFinalized._amount,
              }),
            ]
          }
        }
      }
    } else if (input.chain === 'base') {
      const network = OPSTACK_NETWORKS.find((n) => n.chain === 'base')
      if (!network) return

      // L2: Capture DepositFinalized (L1 → L2 deposit relay)
      const depositFinalized = parseDepositFinalized(input.log, [
        WSTETH_L2_BRIDGE_BASE,
      ])
      if (depositFinalized) {
        // Find RelayedMessage in same tx
        const relayedMessageLog = input.txLogs.find((log) => {
          const parsed = parseRelayedMessage(log, [
            network.l2CrossDomainMessenger,
          ])
          return parsed !== undefined
        })

        if (relayedMessageLog) {
          const relayedMessage = parseRelayedMessage(relayedMessageLog, [
            network.l2CrossDomainMessenger,
          ])
          if (relayedMessage) {
            return [
              LidoWstethDepositFinalized.create(input, {
                chain: 'base',
                msgHash: relayedMessage.msgHash,
                amount: depositFinalized._amount,
              }),
            ]
          }
        }
      }

      // L2: Capture WithdrawalInitiated (L2 → L1 withdrawal)
      const withdrawalInitiated = parseWithdrawalInitiated(input.log, [
        WSTETH_L2_BRIDGE_BASE,
      ])
      if (withdrawalInitiated) {
        // Find MessagePassed in same tx
        const messagePassedLog = input.txLogs.find((log) => {
          const parsed = parseMessagePassed(log, [network.l2ToL1MessagePasser])
          return parsed !== undefined
        })

        if (messagePassedLog) {
          const messagePassed = parseMessagePassed(messagePassedLog, [
            network.l2ToL1MessagePasser,
          ])
          if (messagePassed) {
            return [
              LidoWstethWithdrawalMessagePassed.create(input, {
                chain: 'base',
                withdrawalHash: messagePassed.withdrawalHash,
                amount: withdrawalInitiated._amount,
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
          dstTokenAddress: L2_WSTETH_BASE,
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
          srcTokenAddress: L2_WSTETH_BASE,
          dstEvent: event,
          dstAmount: event.args.amount,
          dstTokenAddress: L1_WSTETH,
        }),
      ]
    }
  }
}
