import { Address32, ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { utils } from 'ethers'
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
} from '../types'

// == L2->L1 messages, all of them. ==

// L2 event
export const MessagePassed = createInteropEventType<{
  chain: string
  withdrawalHash: string
  value: bigint
}>('opstack.MessagePassed', { ttl: 14 * UnixTime.DAY }) // needs to go through the challenge period

const messagePassedLog =
  'event MessagePassed(uint256 indexed nonce, address indexed sender, address indexed target, uint256 value, uint256 gasLimit, bytes data, bytes32 withdrawalHash)'
export const parseMessagePassed = createEventParser(messagePassedLog)

// L1 event
export const WithdrawalFinalized = createInteropEventType<{
  chain: string
  withdrawalHash: string
}>('opstack.WithdrawalFinalized')

const withdrawalFinalizedLog =
  'event WithdrawalFinalized(bytes32 indexed withdrawalHash, bool success)'
export const parseWithdrawalFinalized = createEventParser(
  withdrawalFinalizedLog,
)

// == L1->L2 messages, only those triggered via the CrossDomainMessengers. Notable exception is ETH deposits. ==

// L2 event
export const RelayedMessage = createInteropEventType<{
  chain: string
  msgHash: string
}>('opstack.RelayedMessage')

const relayedMessageLog = 'event RelayedMessage(bytes32 indexed msgHash)'
export const parseRelayedMessage = createEventParser(relayedMessageLog)

// L1 event: this will be a combination of two logs
export const SentMessage = createInteropEventType<{
  chain: string
  msgHash: string
  value: bigint
}>('opstack.SentMessage')

const sentMessageLog =
  'event SentMessage(address indexed target, address sender, bytes message, uint256 messageNonce, uint256 gasLimit)'
export const parseSentMessage = createEventParser(sentMessageLog)

const sentMessageExtension1 =
  'event SentMessageExtension1(address indexed sender, uint256 value)'
export const parseSentMessageExtension1 = createEventParser(
  sentMessageExtension1,
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
    l2ToL1MessagePasser: ChainSpecificAddress(
      'base:0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: ChainSpecificAddress(
      'eth:0x49048044d57e1c92a77f79988d21fa8faf74e97e',
    ),
    l1CrossDomainMessenger: ChainSpecificAddress(
      'eth:0x866E82a600A1414e583f7F13623F1aC5d58b0Afa',
    ),
    l2CrossDomainMessenger: ChainSpecificAddress(
      'base:0x4200000000000000000000000000000000000007',
    ),
    l1StandardBridge: ChainSpecificAddress(
      'eth:0x3154Cf16ccdb4C6d922629664174b904d80F2C35',
    ),
    l2StandardBridge: ChainSpecificAddress(
      'base:0x4200000000000000000000000000000000000010',
    ),
  },
  {
    chain: 'optimism',
    l2ToL1MessagePasser: ChainSpecificAddress(
      'oeth:0x4200000000000000000000000000000000000016',
    ),
    optimismPortal: ChainSpecificAddress(
      'eth:0xbEb5Fc579115071764c7423A4f12eDde41f106Ed',
    ),
    l1CrossDomainMessenger: ChainSpecificAddress(
      'eth:0x25ace71c97B33Cc4729CF772ae268934F7ab5fA1',
    ),
    l2CrossDomainMessenger: ChainSpecificAddress(
      'oeth:0x4200000000000000000000000000000000000007',
    ),
    l1StandardBridge: ChainSpecificAddress(
      'eth:0x99C9fc46f92E8a1c0deC1b1747d010903E884bE1',
    ),
    l2StandardBridge: ChainSpecificAddress(
      'oeth:0x4200000000000000000000000000000000000010',
    ),
  },
])

export class OpStackPlugin implements InteropPluginResyncable {
  readonly name = 'opstack'

  getDataRequests(): DataRequest[] {
    return [
      {
        type: 'event',
        signature: messagePassedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2ToL1MessagePasser),
      },
      {
        type: 'event',
        signature: withdrawalFinalizedLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.optimismPortal),
      },
      {
        type: 'event',
        signature: relayedMessageLog,
        addresses: OPSTACK_NETWORKS.map((n) => n.l2CrossDomainMessenger),
      },
      {
        type: 'event',
        signature: sentMessageLog,
        // txLogs: [sentMessageExtension1],
        addresses: OPSTACK_NETWORKS.map((n) => n.l1CrossDomainMessenger),
      },
    ]
  }

  capture(input: LogToCapture) {
    // get L1 side events
    if (input.chain === 'ethereum') {
      const logAddress = ChainSpecificAddress.fromLong(
        input.chain,
        input.log.address,
      )
      const network = OPSTACK_NETWORKS.find(
        (n) =>
          n.optimismPortal === logAddress ||
          n.l1CrossDomainMessenger === logAddress,
      )
      if (!network) return

      // check if this is an L2->*L1* message
      const withdrawalFinalized = parseWithdrawalFinalized(input.log, [
        ChainSpecificAddress.address(network.optimismPortal),
      ])
      if (withdrawalFinalized) {
        return [
          WithdrawalFinalized.create(input, {
            chain: network.chain,
            withdrawalHash: withdrawalFinalized.withdrawalHash,
          }),
        ]
      }

      // check if this is an *L1*->L2 message
      const sentMessage = parseSentMessage(input.log, [
        ChainSpecificAddress.address(network.l1CrossDomainMessenger),
      ])
      if (sentMessage) {
        // see if we have SentMessageExtension1 event in the same tx
        const nextLog = input.txLogs.find(
          // biome-ignore lint/style/noNonNullAssertion: It's there
          (x) => x.logIndex === input.log.logIndex! + 1,
        )
        const extension =
          nextLog &&
          parseSentMessageExtension1(nextLog, [
            ChainSpecificAddress.address(network.l1CrossDomainMessenger),
          ])

        // Calculate the message hash using the same method as the contract
        const value = extension?.value ?? 0n
        const msgHash = hashCrossDomainMessageV1(
          sentMessage.messageNonce,
          sentMessage.sender,
          sentMessage.target,
          value,
          sentMessage.gasLimit,
          sentMessage.message,
        )

        return [
          SentMessage.create(input, {
            chain: network.chain,
            msgHash,
            value,
          }),
        ]
      }
    } else {
      // get L2 side events
      const network = OPSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return
      // check if this is an *L2*->L1 message
      const messagePassed = parseMessagePassed(input.log, [
        ChainSpecificAddress.address(network.l2ToL1MessagePasser),
      ])
      if (messagePassed) {
        return [
          MessagePassed.create(input, {
            chain: network.chain,
            withdrawalHash: messagePassed.withdrawalHash,
            value: messagePassed.value,
          }),
        ]
      }
      // otherwise check if this is an L1->*L2* message
      const relayedMessage = parseRelayedMessage(input.log, [
        ChainSpecificAddress.address(network.l2CrossDomainMessenger),
      ])
      if (relayedMessage) {
        return [
          RelayedMessage.create(input, {
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

      const results: MatchResult = [
        Result.Message('opstack.L2ToL1Message', {
          app: 'unknown',
          srcEvent: messagePassed,
          dstEvent: event,
        }),
      ]

      // If ETH was sent via L2ToL1MessagePasser, also create a Transfer
      if (messagePassed.args.value > 0n) {
        results.push(
          Result.Transfer('opstack.L2ToL1Transfer', {
            srcEvent: messagePassed,
            srcAmount: messagePassed.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: messagePassed.args.value,
            dstTokenAddress: Address32.NATIVE,
          }),
        )
      }

      return results
    }

    // Match L1->L2 messages
    if (RelayedMessage.checkType(event)) {
      const sentMessage = db.find(SentMessage, {
        msgHash: event.args.msgHash,
        chain: event.args.chain,
      })
      if (!sentMessage) return

      const results: MatchResult = [
        Result.Message('opstack.L1ToL2Message', {
          app: 'unknown',
          srcEvent: sentMessage,
          dstEvent: event,
        }),
      ]

      // If ETH was sent via CrossDomainMessenger, also create a Transfer
      if (sentMessage.args.value > 0n) {
        results.push(
          Result.Transfer('opstack.L1ToL2Transfer', {
            srcEvent: sentMessage,
            srcAmount: sentMessage.args.value,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: sentMessage.args.value,
            dstTokenAddress: Address32.NATIVE,
          }),
        )
      }

      return results
    }
  }
}
