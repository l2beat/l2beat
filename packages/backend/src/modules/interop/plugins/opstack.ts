import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  defineNetworks,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

// == L2->L1 messages, all of them. ==

// L2 event
export const MessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.MessagePassed', { ttl: 14 * UnixTime.DAY }) // needs to go through the challenge period

const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

// L1 event
export const WithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.WithdrawalFinalized')

const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)',
)

// == L1->L2 messages, only those triggered via the CrossDomainMessengers. Notable exception is ETH deposits. ==

// L2 event
export const RelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('opstack.RelayedMessage')

const parseRelayedMessage = createEventParser(
  'event RelayedMessage(bytes32 indexed msgHash)',
)

// L1 event
// TODO

const OPSTACK_NETWORKS = defineNetworks('opstack', [
  {
    chain: 'base',
    l2ToL1MessagePasser: EthereumAddress(
      '0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: EthereumAddress(
      '0x49048044d57e1c92a77f79988d21fa8faf74e97e',
    ),
    l1CrossDomainMessenger: EthereumAddress(
      '0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
    ),
    l2CrossDomainMessenger: EthereumAddress(
      '0x4200000000000000000000000000000000000007',
    ),
  },
])

export class OpStackPlugin implements InteropPlugin {
  name = 'opstack'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      const network = OPSTACK_NETWORKS.find(
        (n) => n.optimismPortal === EthereumAddress(input.log.address),
      )
      if (!network) return
      // check if this is an L2->L1 message (L1 side)
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        network.optimismPortal,
      ])
      if (withdrawalFinalized) {
        return WithdrawalFinalized.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: withdrawalFinalized.withdrawalHash,
        })
      }
      // otherwise check if this is an L1->L2 message (L1 side)
      // TODO
    } else {
      const network = OPSTACK_NETWORKS.find((n) => n.chain === input.ctx.chain)
      if (!network) return
      // check if this is an L2->L1 message (L2 side)
      const messagePassed = parseMessagePassed(input.log, [
        network.l2ToL1MessagePasser,
      ])
      if (messagePassed) {
        return MessagePassed.create(input.ctx, {
          chain: network.chain,
          withdrawalHash: messagePassed.withdrawalHash,
        })
      }
      // otherwise check if this is an L1->L2 message (L2 side)
      const relayedMessage = parseRelayedMessage(input.log, [
        network.l2CrossDomainMessenger,
      ])
      if (relayedMessage) {
        return RelayedMessage.create(input.ctx, {
          chain: network.chain,
          msgHash: relayedMessage.msgHash,
        })
      }
    }
  }

  matchTypes = [WithdrawalFinalized]

  match(
    withdrawalFinalized: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!WithdrawalFinalized.checkType(withdrawalFinalized)) return
    const messagePassed = db.find(MessagePassed, {
      withdrawalHash: withdrawalFinalized.args.withdrawalHash,
      chain: withdrawalFinalized.args.chain,
    })
    if (!messagePassed) return
    return [
      Result.Message('opstack.Message', {
        app: 'unknown',
        srcEvent: messagePassed,
        dstEvent: withdrawalFinalized,
      }),
    ]
  }
}
