/*
Mayan Swift source data comes either from the surrounding MayanForwarder event
or directly from MayanSwift calldata. The protocol itself is lock/release, so it never burns or mints.
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { findParsedAround } from './hyperlane-hwr'
import {
  decodeMayanData,
  findNativeAmountInTx,
  forwardedERC20Log,
  forwardedEthLog,
  logToProtocolData,
  MayanForwarded,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from './mayan-forwarder'
import {
  MAYAN_EVM_CHAINS,
  MAYAN_FORWARDER,
  MAYAN_PROTOCOLS,
  toChainSpecificAddresses,
} from './mayan-shared'
import {
  extractMayanSwiftSettlementDestChain,
  getMayanSwiftSettlementMsgType,
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

const parseOrderCreated = createEventParser(orderCreatedLog)

const parseOrderFulfilled = createEventParser(orderFulfilledLog)

const parseOrderRefunded = createEventParser(orderRefundedLog)

const parseLogMessagePublished = createEventParser(logMessagePublishedLog)

export const OrderCreated = createInteropEventType<{
  key: string
  $dstChain?: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  dstTokenAddress?: Address32
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createInteropEventType<{
  key: string
  dstAmount: bigint
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

type WormholeNetwork = { chain: string; wormholeChainId: number }
type FulfilledOrderEvent = InteropEvent<{
  key: string
  dstAmount: bigint
  $srcChain?: string
}>
type RefundedOrderEvent = InteropEvent<{
  key: string
  refundedAmount: bigint
}>
type TerminalOrderEvent = FulfilledOrderEvent | RefundedOrderEvent
type OrderCreatedEvent = InteropEvent<{
  key: string
  $dstChain?: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  dstTokenAddress?: Address32
}>
type MayanForwardedEvent = InteropEvent<{
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
  tokenOut?: Address32
  $dstChain: string
}>

function findOrderData(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
) {
  const txData =
    typeof input.tx.data === 'string'
      ? (input.tx.data as `0x${string}`)
      : undefined

  return (
    (input.log.logIndex !== null
      ? findParsedAround(input.txLogs, input.log.logIndex, (log) =>
          logToProtocolData(log, wormholeNetworks),
        )
      : undefined) ??
    (txData ? decodeMayanData(txData, wormholeNetworks, []) : undefined)
  )
}

function captureOrderFulfilled(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
) {
  const orderFulfilled = parseOrderFulfilled(input.log, null)
  if (!orderFulfilled) return

  const settlementSent = findSingleSettlementSentInTx(
    input,
    wormholeNetworks,
    orderFulfilled.key,
    orderFulfilled.sequence,
  )

  const events: ReturnType<
    typeof OrderFulfilled.create | typeof SettlementSent.create
  >[] = [
    OrderFulfilled.create(input, {
      key: orderFulfilled.key,
      dstAmount: orderFulfilled.netAmount,
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
  sequence: bigint,
) {
  for (const log of input.txLogs) {
    const logMsg = parseLogMessagePublished(log, null)
    if (
      !logMsg ||
      EthereumAddress(logMsg.sender) !== MAYAN_PROTOCOLS.mayanSwift ||
      logMsg.sequence !== sequence
    ) {
      continue
    }

    // Only single UNLOCK is captured here. BATCH_UNLOCK is handled in mayan-swift-settlement plugin.
    if (
      getMayanSwiftSettlementMsgType(logMsg.payload) !==
      MAYAN_SWIFT_MSG_TYPE_UNLOCK
    ) {
      return
    }

    const srcChainId = extractMayanSwiftSettlementDestChain(logMsg.payload)
    const $dstChain =
      srcChainId === undefined
        ? undefined
        : findChain(wormholeNetworks, (x) => x.wormholeChainId, srcChainId)

    return SettlementSent.create(
      { ...input, log },
      {
        key: orderKey,
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

  const parsed = findOrderData(input, wormholeNetworks)
  const nativeAmount = findNativeAmountInTx(input, [
    MAYAN_PROTOCOLS.mayanSwift,
    MAYAN_FORWARDER,
  ])
  const srcTokenAddress =
    parsed?.tokenIn ??
    (nativeAmount !== undefined ? Address32.NATIVE : undefined)
  const amountIn =
    parsed?.amountIn ??
    (srcTokenAddress === Address32.NATIVE ? nativeAmount : undefined)

  return [
    OrderCreated.create(input, {
      key: orderCreated.key,
      $dstChain: parsed?.dstChain,
      amountIn,
      srcTokenAddress,
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
  const srcAmount = mayanForwarded?.args.amountIn ?? orderCreated.args.amountIn
  const srcTokenAddress =
    mayanForwarded?.args.tokenIn ?? orderCreated.args.srcTokenAddress
  const dstTokenAddress =
    mayanForwarded?.args.tokenOut ?? orderCreated.args.dstTokenAddress

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
      extraEvents: mayanForwarded ? [mayanForwarded] : undefined,
      bridgeType: 'nonMinting',
    }),
  ]
}

export class MayanSwiftPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-swift'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const mayanSwiftAddresses = toChainSpecificAddresses(
      MAYAN_EVM_CHAINS,
      MAYAN_PROTOCOLS.mayanSwift,
    )

    return [
      {
        type: 'event',
        signature: orderCreatedLog,
        includeTx: true,
        includeTxEvents: [
          forwardedEthLog,
          forwardedERC20Log,
          swapAndForwardedEthLog,
          swapAndForwardedERC20Log,
        ],
        addresses: mayanSwiftAddresses,
      },
      {
        type: 'event',
        signature: orderFulfilledLog,
        includeTxEvents: [logMessagePublishedLog],
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
