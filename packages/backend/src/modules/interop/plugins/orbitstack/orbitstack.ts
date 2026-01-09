import { Address32, EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { decodeFunctionData, parseAbi } from 'viem'
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

// ABI for decoding createRetryableTicket calldata (L1)
const CREATE_RETRYABLE_TICKET_SELECTOR = '0x679b6ded'
const createRetryableTicketAbi = parseAbi([
  'function createRetryableTicket(address to, uint256 l2CallValue, uint256 maxSubmissionCost, address excessFeeRefundAddress, address callValueRefundAddress, uint256 gasLimit, uint256 maxFeePerGas, bytes data)',
])

// ABI for decoding submitRetryable calldata (L2 sequencer internal call)
const SUBMIT_RETRYABLE_SELECTOR = '0xc9f95d32'
const submitRetryableAbi = parseAbi([
  'function submitRetryable(bytes32 requestId, uint256 l1BaseFee, uint256 deposit, uint256 callvalue, uint256 gasFeeCap, uint64 gasLimit, uint256 maxSubmissionFee, address feeRefundAddress, address beneficiary, address retryTo, bytes retryData)',
])

// == L2->L1 messages ==

export const parseL2ToL1Tx = createEventParser(
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)',
)

export const parseOutBoxTransactionExecuted = createEventParser(
  'event OutBoxTransactionExecuted(address indexed to, address indexed l2Sender, uint256 indexed zero, uint256 transactionIndex)',
)

// == L1->L2 messages ==

export const parseMessageDelivered = createEventParser(
  'event MessageDelivered(uint256 indexed messageIndex, bytes32 indexed beforeInboxAcc, address inbox, uint8 kind, address sender, bytes32 messageDataHash, uint256 baseFeeL1, uint64 timestamp)',
)

export const parseRedeemScheduled = createEventParser(
  'event RedeemScheduled(bytes32 indexed ticketId, bytes32 indexed retryTxHash, uint64 indexed sequenceNum, uint64 donatedGas, address gasDonor, uint256 maxRefund, uint256 submissionFeeRefund)',
)

// L2 -> L1 (Withdrawal) event types
export const L2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  amount?: bigint // ETH amount if callvalue > 0
  isEthOnly?: boolean // true if ETH sent with no calldata
}>('orbitstack.L2ToL1Tx', { ttl: 14 * UnixTime.DAY })

export const OutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
}>('orbitstack.OutBoxTransactionExecuted')

// L1 -> L2 message event types
export const MessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  txValue: bigint
  isEthOnly?: boolean // true if ETH sent with no calldata (createRetryableTicket with empty data)
}>('orbitstack.MessageDelivered')

export const RedeemScheduled = createInteropEventType<{
  chain: string
  messageNum: string
  retryTxHash: string
  ethAmount?: bigint
}>('orbitstack.RedeemScheduled')

export const ORBITSTACK_NETWORKS = defineNetworks('orbitstack', [
  {
    chain: 'arbitrum',
    // L2 -> L1 (Withdrawals)
    arbsys: EthereumAddress('0x0000000000000000000000000000000000000064'),
    outbox: EthereumAddress('0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840'),
    // L1 -> L2 (Messages)
    bridge: EthereumAddress('0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a'),
    sequencerInbox: EthereumAddress(
      '0x1c479675ad559dc151f6ec7ed3fbf8cee79582b6',
    ),
    arbRetryableTx: EthereumAddress(
      '0x000000000000000000000000000000000000006e',
    ),
    // Gateways
    l1StandardGateway: EthereumAddress(
      '0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
    ),
    l2StandardGateway: EthereumAddress(
      '0x09e9222E96E7B4AE2a407B98d48e330053351EEe',
    ),
    l1WethGateway: EthereumAddress(
      '0xd92023e9d9911199a6711321d1277285e6d4e2db',
    ),
    l2WethGateway: EthereumAddress(
      '0x6c411ad3e74de3e7bd422b94a27770f5b86c623b',
    ),
    l1Weth: EthereumAddress('0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'),
    l2Weth: EthereumAddress('0x82af49447d8a07e3bd95bd0d56f35241523fbab1'),
    customGateways: [
      {
        key: 'custom',
        l1Gateway: EthereumAddress(
          '0xcee284f754e854890e311e3280b767f80797180d',
        ),
        l2Gateway: EthereumAddress(
          '0x096760f208390250649e3e8763348e783aef5562',
        ),
      },
      {
        key: 'dai',
        l1Gateway: EthereumAddress(
          '0xd3b5b60020504bc3489d6949d545893982ba3011',
        ),
        l2Gateway: EthereumAddress(
          '0x467194771dae2967aef3ecbedd3bf9a310c76c65',
        ),
      },
    ],
  },
])

export class OrbitStackPlugin implements InteropPlugin {
  name = 'orbitstack'

  capture(input: LogToCapture) {
    if (input.chain === 'ethereum') {
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.outbox === EthereumAddress(input.log.address),
      )
      if (network) {
        // L2 -> L1 (Withdrawal finalization on L1)
        const otxe = parseOutBoxTransactionExecuted(input.log, [network.outbox])
        if (otxe) {
          return [
            OutBoxTransactionExecuted.create(input, {
              chain: network.chain,
              position: Number(otxe.transactionIndex),
            }),
          ]
        }
      }

      // L1 -> L2 (Message initiation on L1)
      const networkForBridge = ORBITSTACK_NETWORKS.find(
        (n) => n.bridge === EthereumAddress(input.log.address),
      )
      if (networkForBridge) {
        const messageDelivered = parseMessageDelivered(input.log, [
          networkForBridge.bridge,
        ])
        if (messageDelivered) {
          // Filter out SequencerInbox batch submissions - these are batch metadata, not user messages
          if (
            EthereumAddress(messageDelivered.inbox) ===
            networkForBridge.sequencerInbox
          ) {
            return
          }

          // Check if this is an ETH-only deposit (createRetryableTicket with empty data param)
          let isEthOnly: boolean | undefined
          const txValue = input.tx.value ?? 0n
          if (txValue > 0n) {
            const calldata = input.tx.data as `0x${string}`
            if (calldata.startsWith(CREATE_RETRYABLE_TICKET_SELECTOR)) {
              const decoded = decodeFunctionData({
                abi: createRetryableTicketAbi,
                data: calldata,
              })
              // data is the last param (bytes) - if empty, it's ETH-only
              const retryableData = decoded.args[7] as `0x${string}`
              isEthOnly = retryableData === '0x'
            }
          }

          return [
            MessageDelivered.create(input, {
              chain: networkForBridge.chain,
              messageNum: messageDelivered.messageIndex.toString(),
              txValue,
              isEthOnly: isEthOnly || undefined,
            }),
          ]
        }
      }
    } else {
      const network = ORBITSTACK_NETWORKS.find((n) => n.chain === input.chain)
      if (!network) return

      // L2 -> L1 (Withdrawal initiation on L2)
      const l2ToL1Tx = parseL2ToL1Tx(input.log, [network.arbsys])
      if (l2ToL1Tx) {
        const hasEth = l2ToL1Tx.callvalue > 0n
        const hasNoCalldata = l2ToL1Tx.data === '0x'
        return [
          L2ToL1Tx.create(input, {
            chain: network.chain,
            position: Number(l2ToL1Tx.position),
            amount: hasEth ? l2ToL1Tx.callvalue : undefined,
            isEthOnly: hasEth && hasNoCalldata ? true : undefined,
          }),
        ]
      }

      // L1 -> L2 (Message processing on L2)
      const redeemScheduled = parseRedeemScheduled(input.log, [
        network.arbRetryableTx,
      ])
      if (redeemScheduled) {
        const calldata = input.tx.data as `0x${string}`
        if (!calldata.startsWith(SUBMIT_RETRYABLE_SELECTOR)) {
          return
        }

        const decoded = decodeFunctionData({
          abi: submitRetryableAbi,
          data: calldata,
        })
        // requestId (bytes32) is the messageNum
        const messageNum = BigInt(decoded.args[0] as `0x${string}`).toString()
        // callvalue is param 3
        const callValue = decoded.args[3] as bigint

        return [
          RedeemScheduled.create(input, {
            chain: network.chain,
            messageNum,
            retryTxHash: redeemScheduled.retryTxHash,
            ethAmount: callValue > 0n ? callValue : undefined,
          }),
        ]
      }
    }
  }

  matchTypes = [OutBoxTransactionExecuted, RedeemScheduled]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // L2 -> L1 (Withdrawal) matching
    if (OutBoxTransactionExecuted.checkType(event)) {
      const l2ToL1Tx = db.find(L2ToL1Tx, {
        chain: event.args.chain,
        position: event.args.position,
      })
      if (!l2ToL1Tx) return

      const results: MatchResult = [
        Result.Message('orbitstack.L2ToL1Message', {
          app: l2ToL1Tx.args.isEthOnly ? 'orbitstack-eth' : 'unknown',
          srcEvent: l2ToL1Tx,
          dstEvent: event,
        }),
      ]

      // If ETH was sent, create a Transfer
      if (l2ToL1Tx.args.amount) {
        results.push(
          Result.Transfer('orbitstack.L2ToL1Transfer', {
            srcEvent: l2ToL1Tx,
            srcAmount: l2ToL1Tx.args.amount,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: l2ToL1Tx.args.amount,
            dstTokenAddress: Address32.NATIVE,
          }),
        )
      }

      return results
    }

    // L1 -> L2 message matching
    if (RedeemScheduled.checkType(event)) {
      const messageDelivered = db.find(MessageDelivered, {
        chain: event.args.chain,
        messageNum: event.args.messageNum,
      })
      if (!messageDelivered) return

      const results: MatchResult = [
        Result.Message('orbitstack.L1ToL2Message', {
          app: messageDelivered.args.isEthOnly ? 'orbitstack-eth' : 'unknown',
          srcEvent: messageDelivered,
          dstEvent: event,
        }),
      ]

      // If ETH was sent, always create a Transfer (regardless of calldata)
      if (event.args.ethAmount && event.args.ethAmount > 0n) {
        results.push(
          Result.Transfer('orbitstack.L1ToL2Transfer', {
            srcEvent: messageDelivered,
            srcAmount: messageDelivered.args.txValue,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: event.args.ethAmount,
            dstTokenAddress: Address32.NATIVE,
          }),
        )
      }

      return results
    }
  }
}
