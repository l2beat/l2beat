/*
Orbit Stack core plugin. Handles native bridge messaging and ETH transfers.

Tracks two flows:
- L2→L1 withdrawals: L2ToL1Tx (child) → OutBoxTransactionExecuted (parent)
- L1→L2 deposits:    MessageDelivered (parent) → RedeemScheduled (child)

Matching keys:
- L2→L1: `position` (L2ToL1Tx.position == OutBoxTransactionExecuted.transactionIndex)
- L1→L2: `messageNum` (MessageDelivered.messageIndex == submitRetryable.requestId)

Gateway plugins (wethgateway, standardgateway, customgateway) extend this by
capturing their own token-specific events and reusing the core event types.
*/

import {
  Address32,
  assert,
  ChainSpecificAddress,
  EthereumAddress,
  UnixTime,
} from '@l2beat/shared-pure'
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

// ABI for decoding submitRetryable calldata (L2 sequencer internal call)
const SUBMIT_RETRYABLE_SELECTOR = '0xc9f95d32'
const submitRetryableAbi = parseAbi([
  'function submitRetryable(bytes32 requestId, uint256 l1BaseFee, uint256 deposit, uint256 callvalue, uint256 gasFeeCap, uint64 gasLimit, uint256 maxSubmissionFee, address feeRefundAddress, address beneficiary, address retryTo, bytes retryData)',
])

// --- L2→L1 event parsers ---

export const parseL2ToL1Tx = createEventParser(
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)',
)

export const parseOutBoxTransactionExecuted = createEventParser(
  'event OutBoxTransactionExecuted(address indexed to, address indexed l2Sender, uint256 indexed zero, uint256 transactionIndex)',
)

// --- L1→L2 event parsers ---

export const parseMessageDelivered = createEventParser(
  'event MessageDelivered(uint256 indexed messageIndex, bytes32 indexed beforeInboxAcc, address inbox, uint8 kind, address sender, bytes32 messageDataHash, uint256 baseFeeL1, uint64 timestamp)',
)

export const parseRedeemScheduled = createEventParser(
  'event RedeemScheduled(bytes32 indexed ticketId, bytes32 indexed retryTxHash, uint64 indexed sequenceNum, uint64 donatedGas, address gasDonor, uint256 maxRefund, uint256 submissionFeeRefund)',
)

export const parseInboxMessageDelivered = createEventParser(
  'event InboxMessageDelivered(uint256 indexed messageNum, bytes data)',
)

// --- Helpers ---

// L1MessageType_submitRetryableTx = 9
const L1_MESSAGE_TYPE_SUBMIT_RETRYABLE_TX = 9

// Offset of data.length in the packed retryable ticket message (8 * 32 bytes)
// Fields: to, l2CallValue, deposit, maxSubmissionCost, excessFeeRefundAddress,
// callValueRefundAddress, gasLimit, maxFeePerGas (all uint256 due to address casting)
const RETRYABLE_DATA_LENGTH_OFFSET = 256

const addr = ChainSpecificAddress.address

// Determines if a retryable ticket is an ETH-only deposit (no calldata).
// Parses InboxMessageDelivered to check if the retryable data.length == 0.
function getIsEthOnlyFromInbox(
  txLogs: LogToCapture['txLogs'],
  inboxAddress: ChainSpecificAddress,
  messageDelivered: { kind: number; messageIndex: bigint },
): boolean | undefined {
  // Only retryable tickets can be ETH-only deposits
  if (messageDelivered.kind !== L1_MESSAGE_TYPE_SUBMIT_RETRYABLE_TX) {
    return undefined
  }

  // Find InboxMessageDelivered with matching messageNum
  for (const log of txLogs) {
    if (EthereumAddress(log.address) !== addr(inboxAddress)) continue
    const parsed = parseInboxMessageDelivered(log, [addr(inboxAddress)])
    if (parsed?.messageNum !== messageDelivered.messageIndex) continue

    // Extract data.length from packed retryable ticket params
    const packedData = parsed.data
    assert(
      typeof packedData === 'string' && packedData.startsWith('0x'),
      'InboxMessageDelivered data is not a valid hex string',
    )
    // Position in hex string: skip "0x" (2 chars) + offset in bytes * 2 (hex encoding)
    const dataLengthStart = 2 + RETRYABLE_DATA_LENGTH_OFFSET * 2
    assert(
      packedData.length >= dataLengthStart + 64,
      'InboxMessageDelivered packed data too short',
    )

    const dataLengthHex = packedData.slice(
      dataLengthStart,
      dataLengthStart + 64,
    )
    return BigInt('0x' + dataLengthHex) === 0n
  }

  // For retryable tickets, we always expect to find the InboxMessageDelivered event
  assert(false, 'InboxMessageDelivered event not found for retryable ticket')
}

// --- Interop event types ---

export const L2ToL1Tx = createInteropEventType<{
  chain: string
  position: number
  amount?: bigint // ETH amount if callvalue > 0
  isEthOnly?: boolean // true if ETH sent with no calldata
}>('orbitstack.L2ToL1Tx', { ttl: 30 * UnixTime.DAY })

export const OutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
}>('orbitstack.OutBoxTransactionExecuted')

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

// --- Network configuration ---

export const ORBITSTACK_NETWORKS = defineNetworks('orbitstack', [
  {
    chain: 'arbitrum',
    parentChain: 'ethereum',
    arbsys: ChainSpecificAddress(
      'arb1:0x0000000000000000000000000000000000000064',
    ),
    outbox: ChainSpecificAddress(
      'eth:0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840',
    ),
    bridge: ChainSpecificAddress(
      'eth:0x8315177aB297bA92A06054cE80a67Ed4DBd7ed3a',
    ),
    inbox: ChainSpecificAddress(
      'eth:0x4Dbd4fc535Ac27206064B68FfCf827b0A60BAB3f',
    ),
    sequencerInbox: ChainSpecificAddress(
      'eth:0x1c479675ad559DC151F6Ec7ed3FbF8ceE79582B6',
    ),
    arbRetryableTx: ChainSpecificAddress(
      'arb1:0x000000000000000000000000000000000000006E',
    ),
    l1StandardGateway: ChainSpecificAddress(
      'eth:0xa3A7B6F88361F48403514059F1F16C8E78d60EeC',
    ),
    l2StandardGateway: ChainSpecificAddress(
      'arb1:0x09e9222E96E7B4AE2a407B98d48e330053351EEe',
    ),
    l1WethGateway: ChainSpecificAddress(
      'eth:0xd92023E9d9911199a6711321D1277285e6d4e2db',
    ),
    l2WethGateway: ChainSpecificAddress(
      'arb1:0x6c411aD3E74De3E7Bd422b94A27770f5B86C623B',
    ),
    l1Weth: ChainSpecificAddress(
      'eth:0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    ),
    l2Weth: ChainSpecificAddress(
      'arb1:0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
    ),
    customGateways: [
      {
        key: 'custom',
        l1Gateway: ChainSpecificAddress(
          'eth:0xcEe284F754E854890e311e3280b767F80797180d',
        ),
        l2Gateway: ChainSpecificAddress(
          'arb1:0x096760F208390250649E3e8763348E783AEF5562',
        ),
      },
      {
        key: 'dai',
        l1Gateway: ChainSpecificAddress(
          'eth:0xD3B5b60020504bc3489D6949d545893982BA3011',
        ),
        l2Gateway: ChainSpecificAddress(
          'arb1:0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65',
        ),
      },
      {
        key: 'lpt',
        l1Gateway: ChainSpecificAddress(
          'eth:0x6142f1C8bBF02E6A6bd074E8d564c9A5420a0676',
        ),
        l2Gateway: ChainSpecificAddress(
          'arb1:0x6D2457a4ad276000A615295f7A80F79E48CcD318',
        ),
      },
      {
        key: 'grt',
        l1Gateway: ChainSpecificAddress(
          'eth:0x01cDC91B0A9bA741903aA3699BF4CE31d6C5cC06',
        ),
        l2Gateway: ChainSpecificAddress(
          'arb1:0x65E1a5e8946e7E87d9774f5288f41c30a99fD302',
        ),
      },
      {
        key: 'wsteth',
        l1Gateway: ChainSpecificAddress(
          'eth:0x0F25c1DC2a9922304f2eac71DCa9B07E310e8E5a',
        ),
        l2Gateway: ChainSpecificAddress(
          'arb1:0x07D4692291B9E30E326fd31706f686f83f331B82',
        ),
      },
    ],
  },
  {
    chain: 'apechain',
    parentChain: 'arbitrum',
    nativeToken: ChainSpecificAddress(
      'arb1:0x7f9FBf9bDd3F4105C478b996B648FE6e828a1e98', // APE (ERC20 on Arbitrum, native on ApeChain)
    ),
    arbsys: ChainSpecificAddress(
      'ape:0x0000000000000000000000000000000000000064',
    ),
    outbox: ChainSpecificAddress(
      'arb1:0x4F405BA65291063d8A524c2bDf55d4e67405c2aF',
    ),
    bridge: ChainSpecificAddress(
      'arb1:0x6B71AFb4b7725227ab944c96FE018AB9dc0434b8',
    ),
    inbox: ChainSpecificAddress(
      'arb1:0x1B98e4ED82Ee1a91A65a38C690e2266364064D15',
    ),
    sequencerInbox: ChainSpecificAddress(
      'arb1:0xE6a92Ae29E24C343eE66A2B3D3ECB783d65E4a3C',
    ),
    arbRetryableTx: ChainSpecificAddress(
      'ape:0x000000000000000000000000000000000000006E',
    ),
  },
])

// --- Plugin ---

export class OrbitStackPlugin implements InteropPlugin {
  readonly name = 'orbitstack'

  capture(input: LogToCapture) {
    const isParentChain = ORBITSTACK_NETWORKS.some(
      (n) => n.parentChain === input.chain,
    )
    if (isParentChain) {
      const logAddress = EthereumAddress(input.log.address)
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.parentChain === input.chain && addr(n.outbox) === logAddress,
      )
      if (network) {
        const otxe = parseOutBoxTransactionExecuted(input.log, [
          addr(network.outbox),
        ])
        if (otxe) {
          return [
            OutBoxTransactionExecuted.create(input, {
              chain: network.chain,
              position: Number(otxe.transactionIndex),
            }),
          ]
        }
      }

      const networkForBridge = ORBITSTACK_NETWORKS.find(
        (n) => n.parentChain === input.chain && addr(n.bridge) === logAddress,
      )
      if (networkForBridge) {
        const messageDelivered = parseMessageDelivered(input.log, [
          addr(networkForBridge.bridge),
        ])
        if (messageDelivered) {
          // SequencerInbox batch submissions are batch metadata, not user messages
          if (
            EthereumAddress(messageDelivered.inbox) ===
            addr(networkForBridge.sequencerInbox)
          ) {
            return
          }

          const isEthOnly = getIsEthOnlyFromInbox(
            input.txLogs,
            networkForBridge.inbox,
            messageDelivered,
          )

          return [
            MessageDelivered.create(input, {
              chain: networkForBridge.chain,
              messageNum: messageDelivered.messageIndex.toString(),
              txValue: input.tx.value ?? 0n,
              isEthOnly: isEthOnly || undefined,
            }),
          ]
        }
      }
    }

    // A chain can be both parent and child (e.g. Arbitrum is parent for ApeChain)
    const childNetwork = ORBITSTACK_NETWORKS.find(
      (n) => n.chain === input.chain,
    )
    if (childNetwork) {
      const l2ToL1Tx = parseL2ToL1Tx(input.log, [addr(childNetwork.arbsys)])
      if (l2ToL1Tx) {
        const hasEth = l2ToL1Tx.callvalue > 0n
        const hasNoCalldata = l2ToL1Tx.data === '0x'
        return [
          L2ToL1Tx.create(input, {
            chain: childNetwork.chain,
            position: Number(l2ToL1Tx.position),
            amount: hasEth ? l2ToL1Tx.callvalue : undefined,
            isEthOnly: hasEth && hasNoCalldata ? true : undefined,
          }),
        ]
      }

      const redeemScheduled = parseRedeemScheduled(input.log, [
        addr(childNetwork.arbRetryableTx),
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
            chain: childNetwork.chain,
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
    if (OutBoxTransactionExecuted.checkType(event)) {
      const l2ToL1Tx = db.find(L2ToL1Tx, {
        chain: event.args.chain,
        position: event.args.position,
      })
      if (!l2ToL1Tx) return

      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      const parentTokenAddress = network?.nativeToken
        ? Address32.from(ChainSpecificAddress.address(network.nativeToken))
        : Address32.NATIVE

      const results: MatchResult = [
        Result.Message('orbitstack.L2ToL1Message', {
          app: l2ToL1Tx.args.isEthOnly ? 'orbitstack-eth' : 'unknown',
          srcEvent: l2ToL1Tx,
          dstEvent: event,
        }),
      ]

      if (l2ToL1Tx.args.amount) {
        results.push(
          Result.Transfer('orbitstack.L2ToL1Transfer', {
            srcEvent: l2ToL1Tx,
            srcAmount: l2ToL1Tx.args.amount,
            srcTokenAddress: Address32.NATIVE,
            srcWasBurned: true,
            dstEvent: event,
            dstAmount: l2ToL1Tx.args.amount,
            dstTokenAddress: parentTokenAddress,
            dstWasMinted: false,
          }),
        )
      }

      return results
    }

    if (RedeemScheduled.checkType(event)) {
      const messageDelivered = db.find(MessageDelivered, {
        chain: event.args.chain,
        messageNum: event.args.messageNum,
      })
      if (!messageDelivered) return

      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === event.args.chain,
      )
      const parentTokenAddress = network?.nativeToken
        ? Address32.from(ChainSpecificAddress.address(network.nativeToken))
        : Address32.NATIVE

      const results: MatchResult = [
        Result.Message('orbitstack.L1ToL2Message', {
          app: messageDelivered.args.isEthOnly ? 'orbitstack-eth' : 'unknown',
          srcEvent: messageDelivered,
          dstEvent: event,
        }),
      ]

      if (event.args.ethAmount && event.args.ethAmount > 0n) {
        results.push(
          Result.Transfer('orbitstack.L1ToL2Transfer', {
            srcEvent: messageDelivered,
            srcAmount: event.args.ethAmount,
            srcTokenAddress: parentTokenAddress,
            srcWasBurned: false,
            dstEvent: event,
            dstAmount: event.args.ethAmount,
            dstTokenAddress: Address32.NATIVE,
            dstWasMinted: true,
          }),
        )
      }

      return results
    }
  }
}
