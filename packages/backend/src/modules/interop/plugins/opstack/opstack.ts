import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
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
} from '../types'

// == L2->L1 messages, all of them. ==

// L2 event
export const MessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.MessagePassed', { ttl: 14 * UnixTime.DAY }) // needs to go through the challenge period

export const parseMessagePassed = createEventParser(
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)',
)

// L1 event
export const WithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.WithdrawalFinalized')

export const parseWithdrawalFinalized = createEventParser(
  'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)',
)

// == L1->L2 messages, only those triggered via the CrossDomainMessengers. Notable exception is ETH deposits. ==

// L2 event
export const RelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('opstack.RelayedMessage')

export const parseRelayedMessage = createEventParser(
  'event RelayedMessage(bytes32 indexed msgHash)',
)

// L1 event: this will be a combination of two logs
export const SentMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('opstack.SentMessage')

export const parseSentMessage = createEventParser(
  'event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)',
)
export const parseSentMessageExtension1 = createEventParser(
  'event SentMessageExtension1(address indexed sender, uint256 value)',
)

// Interface for encoding the cross-domain message hash
const relayMessageInterface = new utils.Interface([
  'function relayMessage(uint256 _nonce, address _sender, address _target, uint256 _value, uint256 _gasLimit, bytes _data)',
])

export function hashCrossDomainMessageV1(
  nonce: bigint,
  sender: string,
  target: string,
  value: bigint,
  gasLimit: bigint,
  data: string,
): string {
  const encoded = relayMessageInterface.encodeFunctionData('relayMessage', [
    nonce,
    sender,
    target,
    value,
    gasLimit,
    data,
  ])
  return utils.keccak256(encoded)
}

export const OPSTACK_NETWORKS = defineNetworks('opstack', [
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
    l1StandardBridge: EthereumAddress(
      '0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
    ),
    l2StandardBridge: EthereumAddress(
      '0x4200000000000000000000000000000000000010',
    ),
  },
  {
    chain: 'optimism',
    l2ToL1MessagePasser: EthereumAddress(
      '0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: EthereumAddress(
      '0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
    ),
    l1CrossDomainMessenger: EthereumAddress(
      '0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
    ),
    l2CrossDomainMessenger: EthereumAddress(
      '0x4200000000000000000000000000000000000007',
    ),
    l1StandardBridge: EthereumAddress(
      '0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
    ),
    l2StandardBridge: EthereumAddress(
      '0x4200000000000000000000000000000000000010',
    ),
  },
])

export class OpStackPlugin implements InteropPlugin {
  name = 'opstack'

  capture(input: LogToCapture) {
    // get L1 side events
    if (input.ctx.chain === 'ethereum') {
      const logAddress = EthereumAddress(input.log.address)
      const network = OPSTACK_NETWORKS.find(
        (n) =>
          n.optimismPortal === logAddress ||
          n.l1CrossDomainMessenger === logAddress,
      )
      if (!network) return

      // check if this is an L2->*L1* message
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        network.optimismPortal,
      ])
      if (withdrawalFinalized) {
        return [
          WithdrawalFinalized.create(input.ctx, {
            chain: network.chain,
            withdrawalHash: withdrawalFinalized.withdrawalHash,
          }),
        ]
      }

      // check if this is an *L1*->L2 message
      const sentMessage = parseSentMessage(input.log, [
        network.l1CrossDomainMessenger,
      ])
      if (sentMessage) {
        // see if we have SentMessageExtension1 event in the same tx
        const nextLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! + 1,
        )
        const extension =
          nextLog &&
          parseSentMessageExtension1(nextLog, [network.l1CrossDomainMessenger])

        // Calculate the message hash using the same method as the contract
        const msgHash = hashCrossDomainMessageV1(
          sentMessage.messageNonce,
          sentMessage.sender,
          sentMessage.target,
          extension?.value ?? 0n,
          sentMessage.gasLimit,
          sentMessage.message,
        )

        return [
          SentMessage.create(input.ctx, {
            chain: network.chain,
            msgHash,
          }),
        ]
      }
    } else {
      // get L2 side events
      const network = OPSTACK_NETWORKS.find((n) => n.chain === input.ctx.chain)
      if (!network) return
      // check if this is an *L2*->L1 message
      const messagePassed = parseMessagePassed(input.log, [
        network.l2ToL1MessagePasser,
      ])
      if (messagePassed) {
        return [
          MessagePassed.create(input.ctx, {
            chain: network.chain,
            withdrawalHash: messagePassed.withdrawalHash,
          }),
        ]
      }
      // otherwise check if this is an L1->*L2* message
      const relayedMessage = parseRelayedMessage(input.log, [
        network.l2CrossDomainMessenger,
      ])
      if (relayedMessage) {
        return [
          RelayedMessage.create(input.ctx, {
            chain: network.chain,
            msgHash: relayedMessage.msgHash,
          }),
        ]
      }
    }
  }

  matchTypes = [WithdrawalFinalized, RelayedMessage]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L2->L1 withdrawals
    if (WithdrawalFinalized.checkType(event)) {
      const messagePassed = db.find(MessagePassed, {
        withdrawalHash: event.args.withdrawalHash,
        chain: event.args.chain,
      })
      if (!messagePassed) return
      return [
        Result.Message('opstack.L2ToL1Message', {
          app: 'unknown',
          srcEvent: messagePassed,
          dstEvent: event,
        }),
      ]
    }

    // Match L1->L2 messages
    if (RelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return
      return [
        Result.Message('opstack.L1ToL2Message', {
          app: 'unknown',
          srcEvent: sentMessage,
          dstEvent: event,
        }),
      ]
    }
  }
}
