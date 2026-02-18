/*
Mayan SWIFT Protocol. If used independently, it emits only OrderCreated event with order hash and there is no
information about the Order itself. However, when used with MayanForwarder contract, we can capture
ForwardedETH or ForwardedERC20 event which contains order details and the destination chain info.

On the destination there's OrderFulfilled event with the order hash, plus a LogMessagePublished
for settlement back to the source chain. We extract the source chain from the settlement message payload.

Settlement Message Behavior:
- On Ethereum destinations: fulfillOrder is called with batch=false, so wormhole.publishMessage
  is called immediately and LogMessagePublished is emitted in the same tx as OrderFulfilled.
- On L2 destinations (Arbitrum, Base, etc.): fulfillOrder is called with batch=true for gas efficiency.
  The settlement message is stored and later sent via a separate postBatch(bytes32[] orderHashes) call
  that batches multiple settlements into a single wormhole message.

Because of this, we only capture the settlement LogMessagePublished in extraEvents when:
1. It exists in the same tx as OrderFulfilled (Ethereum destinations)
2. The order key in the payload matches the OrderFulfilled key (to avoid capturing unrelated messages)
*/

import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { findBestTransferLog, findParsedAround } from './hyperlane-hwr'
import {
  forwardedERC20Log,
  forwardedEthLog,
  logToProtocolData,
  MayanForwarded,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from './mayan-forwarder'
import {
  extractMayanSwiftSettlementDestChain,
  extractMayanSwiftSettlementOrderKey,
  getMayanSwiftSettlementMsgType,
  MAYAN_SWIFT,
  MAYAN_SWIFT_CHAINS,
  MAYAN_SWIFT_MSG_TYPE_UNLOCK,
} from './mayan-swift.utils'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropEvent,
  type InteropEventDb,
  type InteropPluginResyncable,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

// Event signatures
const orderCreatedLog = 'event OrderCreated(bytes32 key)'
const orderFulfilledLog =
  'event OrderFulfilled(bytes32 key, uint64 sequence, uint256 netAmount)'
const logMessagePublishedLog =
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseOrderCreated = createEventParser(orderCreatedLog)

const parseOrderFulfilled = createEventParser(orderFulfilledLog)

const parseLogMessagePublished = createEventParser(logMessagePublishedLog)

const parseTransfer = createEventParser(transferLog)

export const OrderCreated = createInteropEventType<{
  key: string
  $dstChain: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  srcWasBurned?: boolean
  dstTokenAddress?: Address32
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createInteropEventType<{
  key: string
  dstAmount: bigint
  dstTokenAddress?: Address32
  dstWasMinted?: boolean
  $srcChain?: string
}>('mayan-swift.OrderFulfilled')

// Settlement message sent via wormhole (non-batched case, same tx as OrderFulfilled)
export const SettlementSent = createInteropEventType<{
  key: string
  $dstChain?: string
}>('mayan-swift.SettlementSent')

const DEAD_ADDRESS = Address32.from(
  '0x000000000000000000000000000000000000dEaD',
)

type TransferData = NonNullable<
  ReturnType<typeof findBestTransferLog>['transfer']
>

function findTransferToMayan(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
): TransferData | undefined {
  return findParsedAround(logs, startLogIndex, (log) => {
    const transfer = parseTransfer(log, null)
    if (!transfer) return
    if (EthereumAddress(transfer.to) !== MAYAN_SWIFT) return
    return {
      logAddress: Address32.from(log.address),
      from: Address32.from(transfer.from),
      to: Address32.from(transfer.to),
      value: transfer.value,
    }
  })
}

function isBurnAddress(address: Address32): boolean {
  return address === Address32.ZERO || address === DEAD_ADDRESS
}

export class MayanSwiftPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-swift'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const mayanSwiftAddresses: ChainSpecificAddress[] = []
    for (const chain of MAYAN_SWIFT_CHAINS) {
      try {
        mayanSwiftAddresses.push(
          ChainSpecificAddress.fromLong(chain, MAYAN_SWIFT),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

    return [
      {
        type: 'event',
        signature: orderCreatedLog,
        includeTxEvents: [
          forwardedEthLog,
          forwardedERC20Log,
          swapAndForwardedEthLog,
          swapAndForwardedERC20Log,
          transferLog,
        ],
        addresses: mayanSwiftAddresses,
      },
      {
        type: 'event',
        signature: orderFulfilledLog,
        includeTxEvents: [logMessagePublishedLog, transferLog],
        addresses: mayanSwiftAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    const orderFulfilled = parseOrderFulfilled(input.log, null)
    if (orderFulfilled) {
      const transferMatch =
        input.log.logIndex !== null
          ? findBestTransferLog(
              input.txLogs,
              orderFulfilled.netAmount,
              input.log.logIndex,
            )
          : { hasTransfer: false as const }

      // Find LogMessagePublished in same tx from Mayan Swift to extract source chain
      // The settlement message goes back to the source chain
      // For non-batched (Ethereum destinations), also create SettlementSent event
      let $srcChain: string | undefined
      let settlementSent: ReturnType<typeof SettlementSent.create> | undefined
      for (const log of input.txLogs) {
        const logMsg = parseLogMessagePublished(log, null)
        if (logMsg && EthereumAddress(logMsg.sender) === MAYAN_SWIFT) {
          const msgType = getMayanSwiftSettlementMsgType(logMsg.payload)
          // Only handle single UNLOCK here, BATCH_UNLOCK is handled in mayan-swift-settlement plugin
          if (msgType !== MAYAN_SWIFT_MSG_TYPE_UNLOCK) break

          const orderKey = extractMayanSwiftSettlementOrderKey(logMsg.payload)
          // Verify the order key matches to avoid capturing wrong settlement
          if (orderKey !== orderFulfilled.key) break

          const srcChainId = extractMayanSwiftSettlementDestChain(
            logMsg.payload,
          )
          if (srcChainId !== undefined) {
            $srcChain = findChain(
              wormholeNetworks,
              (x) => x.wormholeChainId,
              srcChainId,
            )
          }

          // Create SettlementSent event for non-batched case
          // Use the log's position to create the event properly
          settlementSent = SettlementSent.create(
            { ...input, log },
            {
              key: orderKey,
              $dstChain: $srcChain, // Settlement destination is the original transfer's source
            },
          )
          break
        }
      }

      const events: ReturnType<
        typeof OrderFulfilled.create | typeof SettlementSent.create
      >[] = [
        OrderFulfilled.create(input, {
          key: orderFulfilled.key,
          dstAmount: orderFulfilled.netAmount,
          dstTokenAddress: transferMatch.transfer?.logAddress,
          dstWasMinted:
            transferMatch.transfer?.from === Address32.ZERO
              ? true
              : transferMatch.transfer
                ? false
                : undefined,
          $srcChain,
        }),
      ]
      if (settlementSent) {
        events.push(settlementSent)
      }
      return events
    }

    const orderCreated = parseOrderCreated(input.log, null)
    if (orderCreated) {
      const logIndex = input.log.logIndex
      const parsed =
        logIndex !== null
          ? findParsedAround(input.txLogs, logIndex, (log) =>
              logToProtocolData(log, wormholeNetworks),
            )
          : undefined
      const sourceTransferFromAmount =
        logIndex !== null &&
        parsed?.amountIn !== undefined &&
        parsed.amountIn > 0n
          ? findBestTransferLog(input.txLogs, parsed.amountIn, logIndex)
              .transfer
          : undefined
      const sourceTransfer =
        (sourceTransferFromAmount &&
        (parsed?.tokenIn === undefined ||
          sourceTransferFromAmount.logAddress === parsed.tokenIn)
          ? sourceTransferFromAmount
          : undefined) ??
        (logIndex !== null
          ? findTransferToMayan(input.txLogs, logIndex)
          : undefined)

      const dstChain = parsed?.dstChain ?? 'unknown_missing_protocolData'
      return [
        OrderCreated.create(input, {
          key: orderCreated.key,
          $dstChain: dstChain,
          amountIn: parsed?.amountIn ?? sourceTransfer?.value ?? input.tx.value, // for eth as srcToken there is no amountIn in protocoldata
          srcTokenAddress: parsed?.tokenIn ?? sourceTransfer?.logAddress,
          srcWasBurned: sourceTransfer
            ? isBurnAddress(sourceTransfer.to)
            : undefined,
          dstTokenAddress: parsed?.tokenOut,
        }),
      ]
    }
  }

  matchTypes = [OrderFulfilled]
  match(
    orderFulfilled: InteropEvent,
    db: InteropEventDb,
  ): MatchResult | undefined {
    if (!OrderFulfilled.checkType(orderFulfilled)) return
    const orderCreated = db.find(OrderCreated, {
      key: orderFulfilled.args.key,
    })
    if (!orderCreated) return
    const mayanForwarded = db.find(MayanForwarded, {
      sameTxAfter: orderCreated,
    })
    const orderCreatedAmount = orderCreated.args.amountIn
    const forwardedAmount = mayanForwarded?.args.amountIn
    const srcAmount =
      forwardedAmount !== undefined && forwardedAmount !== 0n
        ? forwardedAmount // MayanForwarded has WETH Withdrawal detection for ForwardedEth with tx.value=0
        : orderCreatedAmount !== undefined && orderCreatedAmount !== 0n
          ? orderCreatedAmount
          : undefined // 7702 + native ETH with no WETH Withdrawal - can't determine from events
    const srcTokenAddress =
      mayanForwarded?.args.tokenIn ?? orderCreated.args.srcTokenAddress
    const dstTokenAddress =
      mayanForwarded?.args.tokenOut ??
      orderFulfilled.args.dstTokenAddress ??
      orderCreated.args.dstTokenAddress
    const srcWasBurned =
      mayanForwarded?.args.srcWasBurned ?? orderCreated.args.srcWasBurned
    const dstWasMinted = orderFulfilled.args.dstWasMinted

    // Settlement messages (LogMessagePublished → OrderUnlocked) are matched separately
    // by the mayan-swift-settlement plugin

    return [
      // NOTE: This is a synthetic message. The real thing goes through wormhole and solana and we can't see it
      Result.Message('mayan-swift.Message', {
        app: 'mayan-swift',
        srcEvent: orderCreated,
        dstEvent: orderFulfilled,
      }),
      Result.Transfer('mayan-swift.Transfer', {
        srcEvent: orderCreated,
        srcAmount,
        srcTokenAddress,
        dstEvent: orderFulfilled,
        dstAmount: orderFulfilled.args.dstAmount,
        dstTokenAddress,
        srcWasBurned,
        dstWasMinted,
        extraEvents: mayanForwarded ? [mayanForwarded] : undefined,
      }),
    ]
  }
}
