import { Address32 } from '@l2beat/shared-pure'
import {
  createEventParser,
  createInteropEventType,
  type InteropEvent,
  type InteropEventDb,
  type InteropPlugin,
  type LogToCapture,
  type MatchResult,
  Result,
} from './types'

const swapExecutedLog = 'event SwapExecuted(uint256 indexed encodedSwap)'
const swapReleasedLog = 'event SwapReleased(uint256 indexed encodedSwap)'
const tokenBurnExecutedLog =
  'event TokenBurnExecuted(bytes32 indexed reqId, address indexed proposer)'
const tokenMintExecutedLog =
  'event TokenMintExecuted(bytes32 indexed reqId, address indexed recipient)'

const parseSwapExecuted = createEventParser(swapExecutedLog)
const parseSwapReleased = createEventParser(swapReleasedLog)
const parseTokenBurnExecuted = createEventParser(tokenBurnExecutedLog)
const parseTokenMintExecuted = createEventParser(tokenMintExecutedLog)
const parseTransfer = createEventParser(
  'event Transfer(address indexed from, address indexed to, uint256 value)',
)

type MesonSwapArgs = {
  encodedSwap: bigint
  inChain: number
  outChain: number
  inToken: number
  outToken: number
  tokenAddress?: Address32
  amount: bigint
  wasBurned?: boolean
  wasMinted?: boolean
}

type MesonTunnelArgs = {
  reqId: `0x${string}`
  action: number
  tokenIndex: number
  amount: bigint
  from: number
  to: number
  tokenAddress?: Address32
  wasBurned?: boolean
  wasMinted?: boolean
}

const MesonSwapExecuted = createInteropEventType<MesonSwapArgs>(
  'meson.SwapExecuted',
  { direction: 'outgoing' },
)
const MesonSwapReleased = createInteropEventType<MesonSwapArgs>(
  'meson.SwapReleased',
  { direction: 'incoming' },
)
const MesonTunnelBurnExecuted = createInteropEventType<MesonTunnelArgs>(
  'meson.TunnelBurnExecuted',
  { direction: 'outgoing' },
)
const MesonTunnelMintExecuted = createInteropEventType<MesonTunnelArgs>(
  'meson.TunnelMintExecuted',
  { direction: 'incoming' },
)

export class MesonPlugin implements InteropPlugin {
  readonly name = 'meson'

  capture(input: LogToCapture) {
    const swapExecuted = parseSwapExecuted(input.log, null)
    if (swapExecuted) {
      const decoded = decodeSwap(swapExecuted.encodedSwap)
      // scale from 6 to 18 decimals for consistency
      const tokenData = resolveTokenData(input, decoded.amount * 10n ** 12n)
      return [
        MesonSwapExecuted.create(input, {
          encodedSwap: swapExecuted.encodedSwap,
          inChain: decoded.inChain,
          outChain: decoded.outChain,
          inToken: decoded.inToken,
          outToken: decoded.outToken,
          tokenAddress: tokenData.tokenAddress,
          amount: tokenData.amount,
          wasBurned: tokenData.wasBurned,
        }),
      ]
    }

    const swapReleased = parseSwapReleased(input.log, null)
    if (swapReleased) {
      const decoded = decodeSwap(swapReleased.encodedSwap)
      // scale from 6 to 18 decimals for consistency
      const tokenData = resolveTokenData(input, decoded.amount * 10n ** 12n)
      return [
        MesonSwapReleased.create(input, {
          encodedSwap: swapReleased.encodedSwap,
          inChain: decoded.inChain,
          outChain: decoded.outChain,
          inToken: decoded.inToken,
          outToken: decoded.outToken,
          tokenAddress: tokenData.tokenAddress,
          amount: tokenData.amount,
          wasMinted: tokenData.wasMinted,
        }),
      ]
    }

    const tokenBurnExecuted = parseTokenBurnExecuted(input.log, null)
    if (tokenBurnExecuted) {
      const decoded = decodeReqId(tokenBurnExecuted.reqId)
      const tokenData = resolveTokenData(input, decoded.amount * 10n ** 12n) // scale from 6 to 18 decimals for consistency
      return [
        MesonTunnelBurnExecuted.create(input, {
          reqId: tokenBurnExecuted.reqId,
          action: decoded.action,
          tokenIndex: decoded.tokenIndex,
          amount: tokenData.amount,
          from: decoded.from,
          to: decoded.to,
          tokenAddress: tokenData.tokenAddress,
          wasBurned: tokenData.wasBurned,
        }),
      ]
    }

    const tokenMintExecuted = parseTokenMintExecuted(input.log, null)
    if (tokenMintExecuted) {
      const decoded = decodeReqId(tokenMintExecuted.reqId)
      const tokenData = resolveTokenData(input, decoded.amount * 10n ** 12n) // scale from 6 to 18 decimals for consistency
      return [
        MesonTunnelMintExecuted.create(input, {
          reqId: tokenMintExecuted.reqId,
          action: decoded.action,
          tokenIndex: decoded.tokenIndex,
          amount: tokenData.amount,
          from: decoded.from,
          to: decoded.to,
          tokenAddress: tokenData.tokenAddress,
          wasMinted: tokenData.wasMinted,
        }),
      ]
    }
  }

  matchTypes = [MesonSwapReleased, MesonTunnelMintExecuted]
  match(event: InteropEvent, db: InteropEventDb): MatchResult | undefined {
    if (MesonSwapReleased.checkType(event)) {
      const swapExecuted = db.find(MesonSwapExecuted, {
        encodedSwap: event.args.encodedSwap,
      })
      if (!swapExecuted) return

      return [
        Result.Message('meson.Message', {
          app: 'meson-swap',
          srcEvent: swapExecuted,
          dstEvent: event,
        }),
        Result.Transfer('mesonSwap.Transfer', {
          srcEvent: swapExecuted,
          srcTokenAddress: swapExecuted.args.tokenAddress,
          srcAmount: swapExecuted.args.amount,
          dstEvent: event,
          dstTokenAddress: event.args.tokenAddress,
          dstAmount: event.args.amount,
          srcWasBurned: swapExecuted.args.wasBurned,
          dstWasMinted: event.args.wasMinted,
        }),
      ]
    }

    if (MesonTunnelMintExecuted.checkType(event)) {
      const burnExecuted = db.find(MesonTunnelBurnExecuted, {
        reqId: event.args.reqId,
      })
      if (!burnExecuted) return

      return [
        Result.Message('meson.Message', {
          app: 'meson-tunnel',
          srcEvent: burnExecuted,
          dstEvent: event,
        }),
        Result.Transfer('mesonTunnel.Transfer', {
          srcEvent: burnExecuted,
          srcTokenAddress: burnExecuted.args.tokenAddress,
          srcAmount: burnExecuted.args.amount,
          dstEvent: event,
          dstTokenAddress: event.args.tokenAddress,
          dstAmount: event.args.amount,
          srcWasBurned: burnExecuted.args.wasBurned,
          dstWasMinted: event.args.wasMinted,
        }),
      ]
    }
  }
}

function decodeSwap(encodedSwap: bigint) {
  return {
    inChain: Number((encodedSwap >> 8n) & 0xffffn),
    inToken: Number(encodedSwap & 0xffn),
    outChain: Number((encodedSwap >> 32n) & 0xffffn),
    outToken: Number((encodedSwap >> 24n) & 0xffn),
    amount: (encodedSwap >> 208n) & 0xffffffffffn,
  }
}

function decodeReqId(reqId: `0x${string}`) {
  const value = BigInt(reqId)
  return {
    action: Number((value >> 200n) & 0xffn),
    tokenIndex: Number((value >> 192n) & 0xffn),
    amount: (value >> 128n) & 0xffffffffffffffffn,
    from: Number((value >> 120n) & 0xffn),
    to: Number((value >> 112n) & 0xffn),
  }
}

function resolveTokenData(input: LogToCapture, targetAmount: bigint) {
  const transferMatch = findBestTransferLogByNormalizedAmount(
    input.txLogs,
    targetAmount,
    input.log.logIndex ?? -1,
  )
  if (transferMatch.transfer) {
    return {
      tokenAddress: transferMatch.transfer.logAddress,
      amount: transferMatch.transfer.value,
      wasBurned: transferMatch.transfer.to === Address32.ZERO,
      wasMinted: transferMatch.transfer.from === Address32.ZERO,
    }
  }

  const txValue = input.tx.value ?? 0n
  if (txValue > 0n) {
    return {
      tokenAddress: Address32.NATIVE,
      amount: txValue,
      wasBurned: false,
      wasMinted: false,
    }
  }

  return {
    // incoming native transfers have tx.value = 0
    tokenAddress: Address32.NATIVE,
    amount: targetAmount,
    wasBurned: false,
    wasMinted: false,
  }
}

type ParsedTransferLog = {
  logAddress: Address32
  from: Address32
  to: Address32
  value: bigint
}

function findBestTransferLogByNormalizedAmount(
  logs: LogToCapture['txLogs'],
  targetAmount: bigint,
  startLogIndex: number,
): { transfer?: ParsedTransferLog; hasTransfer: boolean } {
  let closestMatch: ParsedTransferLog | undefined
  let closestDelta: bigint | undefined
  let closestDistance: number | undefined
  let hasTransfer = false
  const normalizedTargetAmount = normalizeAmount(targetAmount)

  for (const log of logs) {
    const transfer = parseTransfer(log, null)
    if (!transfer) continue

    hasTransfer = true
    const parsed: ParsedTransferLog = {
      logAddress: Address32.from(log.address),
      from: Address32.from(transfer.from),
      to: Address32.from(transfer.to),
      value: transfer.value,
    }

    const delta = absDiff(
      normalizeAmount(transfer.value),
      normalizedTargetAmount,
    )
    const distance =
      log.logIndex === null
        ? Number.POSITIVE_INFINITY
        : Math.abs(log.logIndex - startLogIndex)

    if (
      closestDelta === undefined ||
      delta < closestDelta ||
      (delta === closestDelta &&
        (closestDistance === undefined || distance < closestDistance))
    ) {
      closestDelta = delta
      closestDistance = distance
      closestMatch = parsed
    }
  }

  return { transfer: closestMatch, hasTransfer }
}

function normalizeAmount(value: bigint): bigint {
  if (value === 0n) return 0n
  let normalized = value
  while (normalized % 10n === 0n) {
    normalized /= 10n
  }
  return normalized
}

function absDiff(value: bigint, target: bigint): bigint {
  return value >= target ? value - target : target - value
}
