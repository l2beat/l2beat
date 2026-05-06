/*
Mayan Swift source data comes either from the surrounding MayanForwarder event
or directly from MayanSwift calldata. The protocol itself is lock/release, so it never burns or mints.
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { getInteropTransactionDataCandidates } from '../dto/interopTransaction'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { findParsedAround, findTransferLogBefore } from './logScan'
import {
  decodeMayanData,
  findNativeAmountInTx,
  forwardedERC20Log,
  forwardedEthLog,
  isMayanSwiftForwarded,
  logToProtocolData,
  MayanForwarded,
  swapAndForwardedERC20Log,
  swapAndForwardedEthLog,
} from './mayan-forwarder'
import {
  isMayanSwiftSettlementSender,
  MAYAN_EVM_CHAINS,
  MAYAN_FORWARDER,
  MAYAN_PROTOCOLS,
  toChainSpecificAddresses,
} from './mayan-shared'
import {
  extractMayanSwiftFulfillDestTokenFromTxData,
  extractMayanSwiftFulfillSourceChainFromTxData,
  extractMayanSwiftSettlementDestChain,
  extractMayanSwiftSettlementUnlockKey,
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
import {
  WormholeConfig,
  type WormholeNetwork,
} from './wormhole/wormhole.config'

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
  $dstChain?: string
  amountIn?: bigint
  srcTokenAddress?: Address32
  dstTokenAddress?: Address32
}>('mayan-swift.OrderCreated')

export const OrderFulfilled = createInteropEventType<{
  key: string
  dstAmount: bigint
  $srcChain?: string
  dstTokenAddress?: Address32
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

type FulfilledOrderEvent = InteropEvent<{
  key: string
  dstAmount: bigint
  $srcChain?: string
  dstTokenAddress?: Address32
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
  mayanProtocol?: EthereumAddress
  tokenIn: Address32
  amountIn?: bigint
  tokenOut?: Address32
  $dstChain?: string
}>

function findOrderData(
  input: LogToCapture,
  wormholeNetworks: WormholeNetwork[],
) {
  const fromTxLogs =
    input.log.logIndex !== null
      ? findParsedAround(input.txLogs, input.log.logIndex, (log) =>
          logToProtocolData(log, wormholeNetworks),
        )
      : undefined
  if (fromTxLogs) return fromTxLogs

  for (const txData of getInteropTransactionDataCandidates(input.tx)) {
    const decoded = decodeMayanData(
      txData as `0x${string}`,
      wormholeNetworks,
      [],
    )
    if (decoded) return decoded
  }
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
  const fulfilledSrcChainId = getInteropTransactionDataCandidates(input.tx)
    .map((txData) =>
      extractMayanSwiftFulfillSourceChainFromTxData(txData as `0x${string}`),
    )
    .find((srcChainId): srcChainId is number => srcChainId !== undefined)
  const dstTokenAddress = getInteropTransactionDataCandidates(input.tx)
    .map((txData) =>
      extractMayanSwiftFulfillDestTokenFromTxData(txData as `0x${string}`),
    )
    .find(
      (tokenAddress): tokenAddress is Address32 => tokenAddress !== undefined,
    )
  const transferMatch =
    input.log.logIndex === null
      ? undefined
      : findTransferLogBefore(
          input.txLogs,
          input.log.logIndex,
          (log) => parseTransfer(log, null),
          (transfer) => transfer.value === orderFulfilled.netAmount,
        )
  const $srcChain =
    settlementSent?.args.$dstChain ??
    (fulfilledSrcChainId === undefined || wormholeNetworks.length === 0
      ? undefined
      : findChain(
          wormholeNetworks,
          (x) => x.wormholeChainId,
          fulfilledSrcChainId,
        ))

  const events: ReturnType<
    typeof OrderFulfilled.create | typeof SettlementSent.create
  >[] = [
    OrderFulfilled.create(input, {
      key: orderFulfilled.key,
      dstAmount: orderFulfilled.netAmount,
      $srcChain,
      dstTokenAddress: dstTokenAddress ?? transferMatch?.transfer?.logAddress,
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
  const network = wormholeNetworks.find((n) => n.chain === input.chain)
  for (const log of input.txLogs) {
    const logMsg = parseLogMessagePublished(
      log,
      network?.coreContract ? [network.coreContract] : null,
    )
    if (
      !logMsg ||
      logMsg.sequence !== sequence ||
      !isMayanSwiftSettlementSender(EthereumAddress(logMsg.sender))
    ) {
      continue
    }

    // Only single UNLOCK is captured here. BATCH_UNLOCK is handled in mayan-swift-settlement plugin.
    if (
      getMayanSwiftSettlementMsgType(logMsg.payload) !==
        MAYAN_SWIFT_MSG_TYPE_UNLOCK ||
      extractMayanSwiftSettlementUnlockKey(logMsg.payload) !== orderKey
    ) {
      continue
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

function findMayanSwiftForwardedAfter(
  db: InteropEventDb,
  event: InteropEvent,
): MayanForwardedEvent | undefined {
  return db
    .findAll(MayanForwarded, { sameTxAfter: event })
    .find(isMayanSwiftForwarded) as MayanForwardedEvent | undefined
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
    mayanForwarded?.args.tokenOut ??
    orderCreated.args.dstTokenAddress ??
    orderFulfilled.args.dstTokenAddress

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
      srcWasBurned: false,
      dstWasMinted: false,
    }),
  ]
}

export class MayanSwiftPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-swift'

  constructor(
    private configs: InteropConfigStore,
    private oneSidedChains: string[] = [],
  ) {}

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
        includeTx: true,
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
    const wormholeNetworks = this.configs.get(WormholeConfig) ?? []

    return (
      captureOrderFulfilled(input, wormholeNetworks) ??
      captureOrderCreated(input, wormholeNetworks) ??
      captureOrderRefunded(input)
    )
  }

  matchTypes = [OrderCreated, OrderFulfilled, OrderRefunded]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (OrderCreated.checkType(event)) {
      const hasTerminalEvent =
        db.find(OrderFulfilled, { key: event.args.key }) ??
        db.find(OrderRefunded, { key: event.args.key })
      if (hasTerminalEvent) return

      const mayanForwarded = findMayanSwiftForwardedAfter(db, event)
      const dstChain = mayanForwarded?.args.$dstChain ?? event.args.$dstChain
      if (!dstChain || !this.oneSidedChains.includes(dstChain)) return

      return [
        Result.Transfer('mayan-swift.Transfer', {
          srcEvent: event,
          dstChain,
          srcAmount: mayanForwarded?.args.amountIn ?? event.args.amountIn,
          srcTokenAddress:
            mayanForwarded?.args.tokenIn ?? event.args.srcTokenAddress,
          dstTokenAddress:
            mayanForwarded?.args.tokenOut ?? event.args.dstTokenAddress,
          extraEvents: mayanForwarded ? [mayanForwarded] : undefined,
          bridgeType: 'nonMinting',
          srcWasBurned: false,
          dstWasMinted: false,
        }),
      ]
    }

    const orderEvent = asTerminalOrderEvent(event)
    if (!orderEvent) return

    const orderCreated = db.find(OrderCreated, {
      key: orderEvent.args.key,
    }) as OrderCreatedEvent | undefined

    if (OrderRefunded.checkType(orderEvent)) {
      if (!orderCreated) return
      const mayanForwarded = findMayanSwiftForwardedAfter(db, orderCreated)
      return matchRefundedOrder(orderCreated, orderEvent, mayanForwarded)
    }

    if (!orderCreated) {
      const srcChain = orderEvent.args.$srcChain
      if (!srcChain || !this.oneSidedChains.includes(srcChain)) return

      return [
        Result.Transfer('mayan-swift.Transfer', {
          srcChain,
          dstEvent: orderEvent,
          dstTokenAddress: orderEvent.args.dstTokenAddress,
          dstAmount: orderEvent.args.dstAmount,
          bridgeType: 'nonMinting',
          srcWasBurned: false,
          dstWasMinted: false,
        }),
      ]
    }

    const mayanForwarded = findMayanSwiftForwardedAfter(db, orderCreated)
    return matchFulfilledOrder(orderCreated, orderEvent, mayanForwarded)
  }
}
