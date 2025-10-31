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

// == L1 -> L2 WETH deposits ==

// L1 initiation of L1->L2 WETH deposit
export const DepositInitiatedMessageDelivered = createInteropEventType<{
  chain: string
  messageNum: string
  l1Token: Address32
  l2Token: Address32
  amount: string
}>('orbitstack-wethgateway.MessageDeliveredDepositInitiated')

const parseDepositInitiated = createEventParser(
  'event DepositInitiated(address l1Token, address indexed from, address indexed to, uint256 indexed sequenceNumber, uint256 amount)',
)

// L2 finalization of L1->L2 WETH deposit (Type 0x68 transaction)
const DepositFinalized = createInteropEventType<{
  chain: string
  l1Token: Address32
  l2Token: Address32
  amount: string
}>('orbitstack-wethgateway.DepositFinalized')

const parseDepositFinalized = createEventParser(
  'event DepositFinalized(address indexed l1Token, address indexed from, address indexed to, uint256 amount)',
)

// WETH token and gateway addresses
const WETH_L2 = EthereumAddress('0x82af49447d8a07e3bd95bd0d56f35241523fbab1')
const WETH_GATEWAY_L1 = EthereumAddress(
  '0xd92023e9d9911199a6711321d1277285e6d4e2db',
)
const WETH_GATEWAY_L2 = EthereumAddress(
  '0x6c411ad3e74de3e7bd422b94a27770f5b86c623b',
)

export class OrbitStackWethGatewayPlugin implements InteropPlugin {
  name = 'orbitstack-wethgateway'

  capture(input: LogToCapture) {
    if (input.ctx.chain === 'ethereum') {
      // L1 -> L2 WETH deposit initiated
      const depositInitiated = parseDepositInitiated(input.log, [
        WETH_GATEWAY_L1,
      ])
      if (depositInitiated) {
        // Find which network this deposit is for by looking for MessageDelivered
        for (const network of ORBITSTACK_NETWORKS) {
          const messageDeliveredLog = input.txLogs.find((log) => {
            const parsed = parseMessageDelivered(log, [network.bridge])
            // The sequenceNumber in DepositInitiated equals the messageIndex in MessageDelivered
            return (
              parsed !== undefined &&
              parsed.messageIndex === depositInitiated.sequenceNumber
            )
          })

          if (messageDeliveredLog) {
            const messageDelivered = parseMessageDelivered(
              messageDeliveredLog,
              [network.bridge],
            )
            if (messageDelivered) {
              return DepositInitiatedMessageDelivered.create(input.ctx, {
                chain: network.chain,
                messageNum: messageDelivered.messageIndex.toString(),
                l1Token: Address32.from(depositInitiated.l1Token),
                l2Token: Address32.from(WETH_L2),
                amount: depositInitiated.amount.toString(),
              })
            }
          }
        }
      }
    } else {
      // L2 finalization of L1->L2 WETH deposit (Type 0x68 transaction)
      const network = ORBITSTACK_NETWORKS.find(
        (x) => x.chain === input.ctx.chain,
      )
      if (!network) return

      const depositFinalized = parseDepositFinalized(input.log, [
        WETH_GATEWAY_L2,
      ])
      if (depositFinalized) {
        return DepositFinalized.create(input.ctx, {
          chain: network.chain,
          l1Token: Address32.from(depositFinalized.l1Token),
          l2Token: Address32.from(WETH_L2),
          amount: depositFinalized.amount.toString(),
        })
      }
    }
  }

  matchTypes = [DepositFinalized]

  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    // Match L1->L2 WETH deposits
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

      // Find the L1 DepositInitiated event with WETH details
      const depositInitiated = db.find(DepositInitiatedMessageDelivered, {
        messageNum: redeemScheduled.args.messageNum,
        chain: event.ctx.chain,
      })
      if (!depositInitiated) return

      return [
        Result.Message('orbitstack.L1ToL2Message', {
          app: 'orbitstack-wethgateway',
          srcEvent: messageDelivered,
          dstEvent: redeemScheduled,
        }),
        Result.Transfer('orbitstack-wethgateway.L1ToL2Transfer', {
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
