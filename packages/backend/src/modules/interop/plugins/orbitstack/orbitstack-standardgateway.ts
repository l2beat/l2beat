import { EthereumAddress } from '@l2beat/shared-pure'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from '../types'
import {
  MessageDelivered,
  ORBITSTACK_NETWORKS,
  parseMessageDelivered,
  RedeemScheduled,
} from './orbitstack'

// L1 initiation of L1->L2 ERC20 deposit
const DepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  l1Token: Address32
  amount: string
}>('orbitstack-standardgateway.MessageDeliveredDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address _l1Token, address indexed _from, address indexed _to, uint256 indexed _sequenceNumber, uint256 _amount)',
)

// L2 finalization of L1->L2 ERC20 deposit (Type 0x68 transaction)
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: string
}>('orbitstack-standardgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

export class OrbitStackStandardGatewayPlugin implements InteropPlugin {
  name = 'orbitstack-standardgateway'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      // L1 -> L2 ERC20 deposit initiated
      const depositInitiated = parseDepositInitiated(input.log, null)
      if (depositInitiated) {
        // Find which network this deposit is for by looking for MessageDelivered
        for (const network of ORBITSTACK_NETWORKS) {
          const messageDeliveredLog = input.txLogs.find((log) => {
            const parsed = parseMessageDelivered(log, [network.bridge])
            // The sequenceNumber in DepositInitiated equals the messageIndex in MessageDelivered
            return (
              parsed !== undefined &&
              parsed.messageIndex === depositInitiated._sequenceNumber
            )
          })

          if (messageDeliveredLog) {
            const messageDelivered = parseMessageDelivered(messageDeliveredLog, [
              network.bridge,
            ])
            if (messageDelivered) {
              return DepositInitiatedMessageDelivered.create(input.ctx, {
                chain: network.chain,
                messageNum: messageDelivered.messageIndex.toString(),
                l1Token: Address32.from(depositInitiated._l1Token),
                amount: depositInitiated._amount.toString(),
              })
            }
          }
        }
      }
    } else {
      // L2 finalization of L1->L2 ERC20 deposit (Type 0x68 transaction)
      const network = ORBITSTACK_NETWORKS.find((x) => x.chain === input.ctx.chain)
      if (!network) return

      const depositFinalized = parseDepositFinalized(input.log, null)
      if (depositFinalized) {
        // Find the Transfer event (minting) in the same transaction to get L2 token address
        const transferLog = input.txLogs.find((log) => {
          const parsed = parseTransfer(log, null)
          // Look for mint (from == 0x0) to the recipient
          return (
            parsed !== undefined &&
            parsed.from === '0x0000000000000000000000000000000000000000' &&
            parsed.to.toLowerCase() === depositFinalized.to.toLowerCase()
          )
        })

        if (transferLog) {
          const transfer = parseTransfer(transferLog, null)
          if (transfer) {
            return DepositFinalized.create(input.ctx, {
              chain: network.chain,
              l1Token: Address32.from(depositFinalized.l1Token),
              l2Token: Address32.from(transferLog.address),
              amount: depositFinalized.amount.toString(),
            })
          }
        }
      }
    }
  }

  matchTypes = [DepositFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L1->L2 ERC20 deposits
    if (DepositFinalized.checkType(event)) {
      // Find RedeemScheduled that references this transaction via retryTxHash
      // RedeemScheduled is in Type 0x69 tx, DepositFinalized is in Type 0x68 tx
      // RedeemScheduled.retryTxHash points to DepositFinalized's txHash
      const redeemScheduled = db.find(RedeemScheduled, {
        retryTxHash: event.ctx.txHash,
        chain: event.ctx.chain,
      })
      if (!redeemScheduled) return

      const messageDelivered = db.find(MessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!messageDelivered) return

      // Find the L1 DepositInitiated event with token details
      const depositInitiated = db.find(DepositInitiatedMessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!depositInitiated) return

      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'orbitstack-standardgateway',
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack-standardgateway.L1ToL2Transfer', {
          srcEvent: depositInitiated,
          srcAmount: BigInt(depositInitiated.args.amount),
          srcTokenAddress: depositInitiated.args.l1Token,
          dstEvent: event,
          dstAmount: BigInt(event.args.amount),
          dstTokenAddress: event.args.l2Token,
        }),
      ]
    }
  }
}
