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

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { findParsedAround } from './hyperlane-hwr'
import {
  forwardedERC20Log,
  forwardedEthLog,
  logToProtocolData,
  MayanForwarded,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from './mayan-forwarder'
import { isBurnAddress, toChainSpecificAddresses } from './mayan-shared'
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
const orderRefundedLog = 'event OrderRefunded(bytes32 key, uint256 netAmount)'
const logMessagePublishedLog =
  'event LogMessagePublished(address indexed sender, uint64 sequence, uint32 nonce, bytes payload, uint8 consistencyLevel)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseOrderCreated = createEventParser(orderCreatedLog)

const parseOrderFulfilled = createEventParser(orderFulfilledLog)

const parseOrderRefunded = createEventParser(orderRefundedLog)

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

export const OrderRefunded = createInteropEventType<{
  key: string
  refundedAmount: bigint
}>('mayan-swift.OrderRefunded')

// Settlement message sent via wormhole (non-batched case, same tx as OrderFulfilled)
export const SettlementSent = createInteropEventType<{
  key: string
  $dstChain?: string
}>('mayan-swift.SettlementSent')

type TransferData = {
  logAddress: Address32
  from: Address32
  to: Address32
  value: bigint
}
type TransferCandidate = TransferData & { distance: number }
type WormholeNetwork = { chain: string; wormholeChainId: number }
type FulfilledOrderEvent = InteropEvent<{
  key: string
  dstAmount: bigint
  dstTokenAddress?: Address32
  dstWasMinted?: boolean
  $srcChain?: string
}>
type RefundedOrderEvent = InteropEvent<{
  key: string
  refundedAmount: bigint
}>
type TerminalOrderEvent = FulfilledOrderEvent | RefundedOrderEvent
type OrderCreatedEvent = InteropEvent<{
  key: string
  $dstChain: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  srcWasBurned?: boolean
  dstTokenAddress?: Address32
}>
type MayanForwardedEvent = InteropEvent<{
  mayanProtocol: string
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
  srcWasBurned?: boolean
  tokenOut?: Address32
  minAmountOut?: bigint
  $dstChain: string
}>

function findBestTransferForContext(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
  options: {
    amount?: bigint
    tokenAddress?: Address32
    preferTransferToMayan?: boolean
  },
): TransferData | undefined {
  const amount =
    options.amount !== undefined && options.amount > 0n
      ? options.amount
      : undefined
  const tokenAddress =
    options.tokenAddress !== undefined &&
    options.tokenAddress !== Address32.NATIVE
      ? options.tokenAddress
      : undefined
  const candidates = getTransferCandidates(logs, startLogIndex)
  if (candidates.length === 0) return

  const tokenMatches = (candidate: TransferCandidate) =>
    tokenAddress === undefined || candidate.logAddress === tokenAddress
  const toMayan = (candidate: TransferCandidate) =>
    Address32.cropToEthereumAddress(Address32.from(candidate.to)) === MAYAN_SWIFT

  // 1st priority: exact amount (if provided) and/or transfer.to == MAYAN_SWIFT.
  if (amount !== undefined && options.preferTransferToMayan) {
    const exactAmountToMayan = pickNearestTransfer(
      candidates.filter(
        (candidate) =>
          candidate.value === amount &&
          toMayan(candidate) &&
          tokenMatches(candidate),
      ),
    )
    if (exactAmountToMayan) return exactAmountToMayan
  }

  if (amount !== undefined) {
    const exactAmount = pickNearestTransfer(
      candidates.filter(
        (candidate) => candidate.value === amount && tokenMatches(candidate),
      ),
    )
    if (exactAmount) return exactAmount
  }

  if (options.preferTransferToMayan) {
    const transferToMayan = pickNearestTransfer(
      candidates.filter(
        (candidate) => toMayan(candidate) && tokenMatches(candidate),
      ),
    )
    if (transferToMayan) return transferToMayan
  }

  // 2nd priority: token match + approximate amount (if amount exists), else token-only.
  if (tokenAddress !== undefined) {
    const tokenMatchesOnly = candidates.filter(
      (candidate) => candidate.logAddress === tokenAddress,
    )
    if (amount !== undefined) {
      return pickClosestAmountTransfer(tokenMatchesOnly, amount)
    }
    return pickNearestTransfer(tokenMatchesOnly)
  }
}

function getTransferCandidates(
  logs: LogToCapture['txLogs'],
  startLogIndex: number,
): TransferCandidate[] {
  const candidates: TransferCandidate[] = []

  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (!transfer) continue
    candidates.push({
      logAddress: Address32.from(log.address),
      from: Address32.from(transfer.from),
      to: Address32.from(transfer.to),
      value: transfer.value,
      distance:
        log.logIndex === null
          ? Number.POSITIVE_INFINITY
          : Math.abs(log.logIndex - startLogIndex),
    })
  }

  return candidates
}

function pickNearestTransfer(
  candidates: TransferCandidate[],
): TransferData | undefined {
  let best: TransferCandidate | undefined
  for (const candidate of candidates) {
    if (!best || candidate.distance < best.distance) {
      best = candidate
    }
  }
  return best
}

function pickClosestAmountTransfer(
  candidates: TransferCandidate[],
  targetAmount: bigint,
): TransferData | undefined {
  let best: TransferCandidate | undefined
  let bestDelta: bigint | undefined

  for (const candidate of candidates) {
    const delta = absDiff(candidate.value, targetAmount)
    if (
      bestDelta === undefined ||
      delta < bestDelta ||
      (delta === bestDelta &&
        best !== undefined &&
        candidate.distance < best.distance)
    ) {
      best = candidate
      bestDelta = delta
    }
  }

  return best
}

function absDiff(value: bigint, target: bigint): bigint {
  return value >= target ? value - target : target - value
}

function captureOrderFulfilled(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
) {
  const orderFulfilled = parseOrderFulfilled(input.log, null)
  if (!orderFulfilled) return

  const transfer =
    input.log.logIndex !== null
      ? findBestTransferForContext(input.txLogs, input.log.logIndex, {
          amount: orderFulfilled.netAmount,
        })
      : undefined

  const settlementSent = findSingleSettlementSentInTx(
    input,
    wormholeNetworks,
    orderFulfilled.key,
  )

  const events: ReturnType<
    typeof OrderFulfilled.create | typeof SettlementSent.create
  >[] = [
    OrderFulfilled.create(input, {
      key: orderFulfilled.key,
      dstAmount: orderFulfilled.netAmount,
      dstTokenAddress: transfer?.logAddress,
      dstWasMinted:
        transfer?.from === Address32.ZERO ? true : transfer ? false : undefined,
      $srcChain: settlementSent?.args.$dstChain,
    }),
  ]
  if (settlementSent) {
    events.push(settlementSent)
  }
  return events
}

function findSingleSettlementSentInTx(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
  orderKey: string,
) {
  for (const log of input.txLogs) {
    const logMsg = parseLogMessagePublished(log, null)
    if (!logMsg || EthereumAddress(logMsg.sender) !== MAYAN_SWIFT) continue

    const msgType = getMayanSwiftSettlementMsgType(logMsg.payload)
    // Only single UNLOCK is captured here. BATCH_UNLOCK is handled in mayan-swift-settlement plugin.
    if (msgType !== MAYAN_SWIFT_MSG_TYPE_UNLOCK) break

    const settlementOrderKey = extractMayanSwiftSettlementOrderKey(
      logMsg.payload,
    )
    if (settlementOrderKey !== orderKey) break

    const srcChainId = extractMayanSwiftSettlementDestChain(logMsg.payload)
    const $dstChain =
      srcChainId === undefined
        ? undefined
        : findChain(wormholeNetworks, (x) => x.wormholeChainId, srcChainId)

    return SettlementSent.create(
      { ...input, log },
      {
        key: settlementOrderKey,
        // Settlement destination is the original transfer source.
        $dstChain,
      },
    )
  }
}

function captureOrderCreated(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
) {
  const orderCreated = parseOrderCreated(input.log, null)
  if (!orderCreated) return

  const logIndex = input.log.logIndex
  const parsed =
    logIndex !== null
      ? findParsedAround(input.txLogs, logIndex, (log) =>
          logToProtocolData(log, wormholeNetworks),
        )
      : undefined
  const sourceTransfer =
    logIndex !== null
      ? findBestTransferForContext(input.txLogs, logIndex, {
          amount: parsed?.amountIn,
          tokenAddress: parsed?.tokenIn,
          preferTransferToMayan: true,
        })
      : undefined

  return [
    OrderCreated.create(input, {
      key: orderCreated.key,
      $dstChain: parsed?.dstChain ?? 'unknown_missing_protocolData',
      amountIn: parsed?.amountIn ?? sourceTransfer?.value ?? input.tx.value, // For native source token, protocolData may omit amountIn.
      srcTokenAddress: parsed?.tokenIn ?? sourceTransfer?.logAddress,
      srcWasBurned: sourceTransfer
        ? isBurnAddress(sourceTransfer.to)
        : undefined,
      dstTokenAddress: parsed?.tokenOut,
    }),
  ]
}

function captureOrderRefunded(input: LogToCapture) {
  const orderRefunded = parseOrderRefunded(input.log, null)
  if (!orderRefunded) return
  return [
    OrderRefunded.create(input, {
      key: orderRefunded.key,
      refundedAmount: orderRefunded.netAmount,
    }),
  ]
}

function asTerminalOrderEvent(
  event: InteropEvent,
): TerminalOrderEvent | undefined {
  if (OrderFulfilled.checkType(event) || OrderRefunded.checkType(event)) {
    return event
  }
}

function matchRefundedOrder(
  orderCreated: OrderCreatedEvent,
  orderRefunded: RefundedOrderEvent,
  mayanForwarded?: MayanForwardedEvent,
): MatchResult {
  return [
    Result.Message('mayan-swift.Message', {
      app: 'mayan-swift-refund',
      srcEvent: orderCreated,
      dstEvent: orderRefunded,
      extraEvents: mayanForwarded ? [mayanForwarded] : undefined,
    }),
  ]
}

function matchFulfilledOrder(
  orderCreated: OrderCreatedEvent,
  orderFulfilled: FulfilledOrderEvent,
  mayanForwarded?: MayanForwardedEvent,
): MatchResult {
  const orderCreatedAmount = orderCreated.args.amountIn
  const forwardedAmount = mayanForwarded?.args.amountIn
  const srcAmount =
    forwardedAmount !== undefined && forwardedAmount !== 0n
      ? forwardedAmount // MayanForwarded has WETH Withdrawal detection for ForwardedEth with tx.value=0.
      : orderCreatedAmount !== undefined && orderCreatedAmount !== 0n
        ? orderCreatedAmount
        : undefined // 7702 + native ETH with no WETH Withdrawal - can't determine from events.
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
  // by the mayan-swift-settlement plugin.
  return [
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

export class MayanSwiftPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-swift'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const mayanSwiftAddresses = toChainSpecificAddresses(
      MAYAN_SWIFT_CHAINS,
      MAYAN_SWIFT,
    )

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
      {
        type: 'event',
        signature: orderRefundedLog,
        addresses: mayanSwiftAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig)
    if (!wormholeNetworks) return

    return (
      captureOrderFulfilled(input, wormholeNetworks) ??
      captureOrderCreated(input, wormholeNetworks) ??
      captureOrderRefunded(input)
    )
  }

  matchTypes = [OrderFulfilled, OrderRefunded]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    const orderEvent = asTerminalOrderEvent(event)
    if (!orderEvent) return

    const orderCreated = db.find(OrderCreated, {
      key: orderEvent.args.key,
    }) as OrderCreatedEvent | undefined
    if (!orderCreated) return
    const mayanForwarded = db.find(MayanForwarded, {
      sameTxAfter: orderCreated,
    }) as MayanForwardedEvent | undefined

    if (OrderRefunded.checkType(orderEvent)) {
      return matchRefundedOrder(orderCreated, orderEvent, mayanForwarded)
    }
    return matchFulfilledOrder(orderCreated, orderEvent, mayanForwarded)
  }
}
