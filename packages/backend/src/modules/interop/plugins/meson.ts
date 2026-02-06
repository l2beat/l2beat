import { Address32 } from '@l2beat/shared-pure'
import { findBestTransferLog } from './hyperlane-hwr'
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
      const tokenData = resolveTokenData(input, decoded.amount)
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
      const tokenData = resolveTokenData(input, decoded.amount)
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
      const tokenData = resolveTokenData(input, decoded.amount)
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
      const tokenData = resolveTokenData(input, decoded.amount)
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
  const transferMatch = findBestTransferLog(
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
