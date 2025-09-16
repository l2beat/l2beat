import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  defineNetworks,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

export const MessagePassed = createBridgeEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.MessagePassed', { ttl: 14 * UnixTime.DAY })

const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)',
)

export const WithdrawalFinalized = createBridgeEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.WithdrawalFinalized')

const OPSTACK_NETWORKS = defineNetworks('opstack', [
  {
    chain: 'base',
    l2ToL1MessagePasser: EthereumAddress(
      '0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: EthereumAddress(
      '0x49048044d57e1c92a77f79988d21fa8faf74e97e',
    ),
  },
])

export class OpStackPlugin implements BridgePlugin {
  name = 'opstack'
  chains = OPSTACK_NETWORKS.map((n) => n.chain)

  capture(input: LogToCapture) {
    const network = OPSTACK_NETWORKS.find((n) => n.chain === input.ctx.chain)
    if (!network) return

    if (input.ctx.chain === 'ethereum') {
      if (!network) return
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        network.optimismPortal,
      ])
      if (withdrawalFinalized) {
        return WithdrawalFinalized.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: withdrawalFinalized.withdrawalHash,
        })
      }
    } else {
      const messagePassed = parseMessagePassed(input.log, [
        network.l2ToL1MessagePasser,
      ])
      if (messagePassed) {
        return MessagePassed.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: messagePassed.withdrawalHash,
        })
      }
    }
  }

  match(
    withdrawalFinalized: BridgeEvent,
    db: BridgeEventDb,
  ): MatchResult | undefined {
    if (!WithdrawalFinalized.checkType(withdrawalFinalized)) return
    const messagePassed = db.find(MessagePassed, {
      withdrawalHash: withdrawalFinalized.args.withdrawalHash,
      chain: withdrawalFinalized.args.chain,
    })
    if (!messagePassed) return
    return [
      Result.Message('opstack.Message', [messagePassed, withdrawalFinalized]),
    ]
  }
}
