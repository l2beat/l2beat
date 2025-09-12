import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  type BridgeEvent,
  type BridgeEventDb,
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  type LogToCapture,
  type MatchResult,
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

const NETWORKS = [
  {
    chain: 'base',
    l2ToL1MessagePasser: EthereumAddress(
      '0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: EthereumAddress(
      '0x49048044d57e1c92a77f79988d21fa8faf74e97e',
    ),
  },
]

export class OpStackPlugin implements BridgePlugin {
  name = 'opstack'
  chains = NETWORKS.map((n) => n.chain)

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      const network = NETWORKS.find(
        (n) => n.optimismPortal === EthereumAddress(input.log.address),
      )
      if (!network) return

      const wf = parseWithdrawalFinalized(input.log, [network.optimismPortal])
      if (wf) {
        return WithdrawalFinalized.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: wf.withdrawalHash,
        })
      }
    } else {
      const network = NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )
      if (!network) return

      const mp = parseMessagePassed(input.log, [network.l2ToL1MessagePasser])
      if (mp) {
        return MessagePassed.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: mp.withdrawalHash,
        })
      }
    }
  }

  match(event: BridgeEvent, db: BridgeEventDb): MatchResult | undefined {
    if (!WithdrawalFinalized.checkType(event)) return

    const messagePassed = db.find(MessagePassed, {
      withdrawalHash: event.args.withdrawalHash,
      chain: event.args.chain,
    })
    if (!messagePassed) return

    return {
      messages: [
        {
          type: 'opstack.Message',
          outbound: messagePassed,
          inbound: event,
        },
      ],
    }
  }
}
