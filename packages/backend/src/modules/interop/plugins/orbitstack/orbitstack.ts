import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import {
  Address32,
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

// == L2->L1 messages ==

const parseL2ToL1Tx = createEventParser(
  'event L2ToL1Tx(address caller, address indexed destination, uint256 indexed hash, uint256 indexed position, uint256 arbBlockNum, uint256 ethBlockNum, uint256 timestamp, uint256 callvalue, bytes data)',
)

const parseOutBoxTransactionExecuted = createEventParser(
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
}>('orbitstack.L2ToL1Tx', { ttl: 14 * UnixTime.DAY })

export const OutBoxTransactionExecuted = createInteropEventType<{
  chain: string
  position: number
}>('orbitstack.OutBoxTransactionExecuted')

// L1 -> L2 message event types
export const MessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
}>('orbitstack.MessageDelivered')

export const RedeemScheduled = createInteropEventType<{
  chain: string
  messageNum: string
  retryTxHash: string
  ethAmount?: string
}>('orbitstack.RedeemScheduled')

export const ORBITSTACK_NETWORKS = defineNetworks('orbitstack', [
  {
    chain: 'arbitrum',
    // L2 -> L1 (Withdrawals)
    arbsys: EthereumAddress('0x0000000000000000000000000000000000000064'),
    outbox: EthereumAddress('0x0B9857ae2D4A3DBe74ffE1d7DF045bb7F96E4840'),
    // L1 -> L2 (Messages)
    bridge: EthereumAddress('0x8315177ab297ba92a06054ce80a67ed4dbd7ed3a'),
    arbRetryableTx: EthereumAddress(
      '0x000000000000000000000000000000000000006e',
    ),
  },
])

export class OrbitStackPlugin implements InteropPlugin {
  name = 'orbitstack'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.outbox === EthereumAddress(input.log.address),
      )
      if (network) {
        // L2 -> L1 (Withdrawal finalization on L1)
        const otxe = parseOutBoxTransactionExecuted(input.log, [network.outbox])
        if (otxe) {
          return OutBoxTransactionExecuted.create(input.ctx, {
            chain: network.chain,
            position: Number(otxe.transactionIndex),
          })
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
          return MessageDelivered.create(input.ctx, {
            chain: networkForBridge.chain,
            messageNum: messageDelivered.messageIndex.toString(),
          })
        }
      }
    } else {
      const network = ORBITSTACK_NETWORKS.find(
        (n) => n.chain === input.ctx.chain,
      )
      if (!network) return

      // L2 -> L1 (Withdrawal initiation on L2)
      const l2ToL1Tx = parseL2ToL1Tx(input.log, [network.arbsys])
      if (l2ToL1Tx) {
        return L2ToL1Tx.create(input.ctx, {
          chain: network.chain,
          position: Number(l2ToL1Tx.position),
        })
      }

      // L1 -> L2 (Message processing on L2)
      const redeemScheduled = parseRedeemScheduled(input.log, [
        network.arbRetryableTx,
      ])
      if (redeemScheduled) {
        // Extract messageNum from transaction calldata
        // The calldata format is: selector (4 bytes) + messageNum (32 bytes) + ...
        // messageNum is the first parameter after the function selector
        const messageNum =
          input.ctx.txData.length >= 2 + 8 + 64
            ? '0x' + input.ctx.txData.slice(2 + 8, 2 + 8 + 64)
            : '0x0'

        // Extract callValue (param 3) from calldata
        // submitRetryable(bytes32,uint256,uint256,uint256,...)
        // Offset: selector (2+8) + param0 (64) + param1 (64) + param2 (64) = 202
        const callValueHex =
          input.ctx.txData.length >= 2 + 8 + 64 * 4
            ? '0x' + input.ctx.txData.slice(2 + 8 + 64 * 3, 2 + 8 + 64 * 4)
            : '0x0'
        const callValue = BigInt(callValueHex)

        return RedeemScheduled.create(input.ctx, {
          chain: network.chain,
          messageNum: BigInt(messageNum).toString(),
          retryTxHash: redeemScheduled.retryTxHash,
          ethAmount: callValue > 0n ? callValue.toString() : undefined,
        })
      }
    }
  }

  matchTypes = [OutBoxTransactionExecuted, RedeemScheduled]
  match(
    event: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    // L2 -> L1 (Withdrawal) matching
    if (OutBoxTransactionExecuted.checkType(event)) {
      const l2ToL1Tx = db.find(L2ToL1Tx, {
        chain: event.args.chain,
        position: event.args.position,
      })
      if (!l2ToL1Tx) return

      return [
        Result.Message('orbitstack.L2ToL1Message', {
          app: 'unknown',
          srcEvent: l2ToL1Tx,
          dstEvent: event,
        }),
      ]
    }

    // L1 -> L2 message matching
    if (RedeemScheduled.checkType(event)) {
      const messageDelivered = db.find(MessageDelivered, {
        chain: event.args.chain,
        messageNum: event.args.messageNum,
      })
      if (!messageDelivered) return

      // Check if this is an ETH deposit (based on L2 callValue)
      if (event.args.ethAmount) {
        // Verify L1 has txValue
        if (!messageDelivered.ctx.txValue || messageDelivered.ctx.txValue === 0n) {
          return
        }

        return [
          Result.Message('orbitstack.L1ToL2Message', {
            app: 'orbitstack',
            srcEvent: messageDelivered,
            dstEvent: event,
          }),
          Result.Transfer('orbitstack-standardgateway.L1ToL2Transfer', {
            srcEvent: messageDelivered,
            srcAmount: messageDelivered.ctx.txValue,
            srcTokenAddress: Address32.NATIVE,
            dstEvent: event,
            dstAmount: BigInt(event.args.ethAmount),
            dstTokenAddress: Address32.NATIVE,
          }),
        ]
      }

      // Regular message (not ETH deposit)
      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'unknown',
          srcEvent: messageDelivered,
          dstEvent: event,
        }),
      ]
    }
  }
}
