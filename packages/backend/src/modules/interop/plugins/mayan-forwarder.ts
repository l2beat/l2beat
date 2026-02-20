/*
Mayan Forwarder
- chooses one of the Mayan protocol
- emits Event that will allow further matching

ETH Amount Detection for ForwardedEth:
When tx.value is 0 (e.g., aggregator transactions via LiFi, 1inch, etc.),
we look for WETH Withdrawal events before ForwardedEth to determine the ETH amount.
This is because aggregators unwrap WETH to ETH before forwarding to Mayan.

Alternative approach (not implemented):
Look for aggregator-specific swap events with toAssetAddress=0x0 (native):
- MagpieRouter Swap(address,address,address,address,uint256,uint256) - amountOut field
- LiFi AssetSwapped(bytes32,address,address,address,uint256,uint256,uint256) - toAmount field
These are more direct but require handling multiple aggregator event formats.
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import { decodeFunctionData, type Log, parseAbi } from 'viem'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV1Config, CCTPV2Config } from './cctp/cctp.config'
import { findBestTransferLog } from './hyperlane-hwr'
import {
  decodeMayanProtocol,
  isBurnAddress,
  MAYAN_FORWARDER,
  MAYAN_FORWARDER_CHAINS,
  MAYAN_WRAPPED_NATIVE_ADDRESSES,
  toChainSpecificAddresses,
} from './mayan-shared'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropPluginResyncable,
  type LogToCapture,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

// Event signatures
export const forwardedEthLog =
  'event ForwardedEth(address mayanProtocol, bytes protocolData)'
export const forwardedERC20Log =
  'event ForwardedERC20(address token, uint256 amount, address mayanProtocol, bytes protocolData)'
export const swapAndForwardedEthLog =
  'event SwapAndForwardedEth(uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)'
export const swapAndForwardedERC20Log =
  'event SwapAndForwardedERC20(address tokenIn, uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)'
const wethWithdrawalLog = 'event Withdrawal(address indexed src, uint256 wad)'
const transferLog =
  'event Transfer(address indexed from, address indexed to, uint256 value)'

const parseWethWithdrawal = createEventParser(wethWithdrawalLog)

export const parseForwardedEth = createEventParser(forwardedEthLog)

export const parseForwardedERC20 = createEventParser(forwardedERC20Log)

export const parseSwapAndForwardedEth = createEventParser(
  swapAndForwardedEthLog,
)

export const parseSwapAndForwardedERC20 = createEventParser(
  swapAndForwardedERC20Log,
)

export const MayanForwarded = createInteropEventType<{
  mayanProtocol: string
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
  srcWasBurned?: boolean
  tokenOut?: Address32
  minAmountOut?: bigint
  $dstChain: string
}>('mayan-forwarder.MayanForwarded')

type ForwarderLogKind =
  | 'ForwardedEth'
  | 'ForwardedERC20'
  | 'SwapAndForwardedEth'
  | 'SwapAndForwardedERC20'

interface NormalizedForwarderLog {
  kind: ForwarderLogKind
  mayanProtocol: string
  protocolData: `0x${string}`
  tokenInFromEvent?: Address32
  amountInFromEvent?: bigint
}

export class MayanForwarderPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-forwarder'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const forwarderAddresses = toChainSpecificAddresses(
      MAYAN_FORWARDER_CHAINS,
      MAYAN_FORWARDER,
    )

    return [
      {
        type: 'event',
        signature: forwardedEthLog,
        includeTxEvents: [wethWithdrawalLog],
        addresses: forwarderAddresses,
      },
      {
        type: 'event',
        signature: forwardedERC20Log,
        includeTxEvents: [transferLog],
        addresses: forwarderAddresses,
      },
      {
        type: 'event',
        signature: swapAndForwardedEthLog,
        addresses: forwarderAddresses,
      },
      {
        type: 'event',
        signature: swapAndForwardedERC20Log,
        includeTxEvents: [transferLog],
        addresses: forwarderAddresses,
      },
    ]
  }

  capture(input: LogToCapture) {
    const wormholeNetworks = this.configs.get(WormholeConfig) ?? []
    const cctpNetworks = [
      ...(this.configs.get(CCTPV1Config) ?? []),
      ...(this.configs.get(CCTPV2Config) ?? []),
    ]
    if (wormholeNetworks.length === 0 && cctpNetworks.length === 0) return

    const normalized = normalizeForwarderLog(input.log)
    if (!normalized) return

    const decodedData = decodeProtocolData(
      normalized.protocolData,
      wormholeNetworks,
      cctpNetworks,
    )
    if (!decodedData) return

    const tokenIn = resolveTokenIn(normalized, decodedData)
    const amountIn = resolveAmountIn(input, normalized, decodedData)

    return [
      MayanForwarded.create(input, {
        mayanProtocol: decodeMayanProtocol(
          input.chain,
          normalized.mayanProtocol,
        ),
        methodSignature: decodedData.methodSignature,
        tokenIn,
        amountIn,
        srcWasBurned: inferSrcWasBurned(input, amountIn, tokenIn),
        tokenOut: decodedData.tokenOut,
        minAmountOut: decodedData.minAmountOut,
        $dstChain: decodedData.dstChain,
      }),
    ]
  }
}

function normalizeForwarderLog(log: Log): NormalizedForwarderLog | undefined {
  const forwardedEth = parseForwardedEth(log, null)
  if (forwardedEth) {
    return {
      kind: 'ForwardedEth',
      mayanProtocol: forwardedEth.mayanProtocol,
      protocolData: forwardedEth.protocolData,
    }
  }

  const forwardedERC20 = parseForwardedERC20(log, null)
  if (forwardedERC20) {
    return {
      kind: 'ForwardedERC20',
      mayanProtocol: forwardedERC20.mayanProtocol,
      protocolData: forwardedERC20.protocolData,
      tokenInFromEvent: Address32.from(forwardedERC20.token),
      amountInFromEvent: forwardedERC20.amount,
    }
  }

  const swapAndForwardedEth = parseSwapAndForwardedEth(log, null)
  if (swapAndForwardedEth) {
    return {
      kind: 'SwapAndForwardedEth',
      mayanProtocol: swapAndForwardedEth.mayanProtocol,
      protocolData: swapAndForwardedEth.mayanData,
      tokenInFromEvent: Address32.NATIVE,
      amountInFromEvent: swapAndForwardedEth.amountIn,
    }
  }

  const swapAndForwardedERC20 = parseSwapAndForwardedERC20(log, null)
  if (swapAndForwardedERC20) {
    return {
      kind: 'SwapAndForwardedERC20',
      mayanProtocol: swapAndForwardedERC20.mayanProtocol,
      protocolData: swapAndForwardedERC20.mayanData,
      tokenInFromEvent: Address32.from(swapAndForwardedERC20.tokenIn),
      amountInFromEvent: swapAndForwardedERC20.amountIn,
    }
  }
}

function resolveTokenIn(
  normalized: NormalizedForwarderLog,
  decodedData: DecodedData,
): Address32 {
  if (normalized.kind === 'ForwardedEth') {
    return decodedData.tokenIn ?? Address32.NATIVE
  }

  if (normalized.kind === 'ForwardedERC20') {
    return (
      decodedData.tokenIn ?? normalized.tokenInFromEvent ?? Address32.NATIVE
    )
  }

  // SwapAndForwarded events always carry user-side input token/amount in the event.
  return normalized.tokenInFromEvent ?? decodedData.tokenIn ?? Address32.NATIVE
}

function resolveAmountIn(
  input: LogToCapture,
  normalized: NormalizedForwarderLog,
  decodedData: DecodedData,
): bigint | undefined {
  if (normalized.kind === 'ForwardedEth') {
    // When tx.value is 0 (e.g. aggregator wrappers), derive ETH amount from wrapped-native Withdrawal.
    const amountIn = decodedData.amountIn ?? input.tx.value
    if (amountIn !== 0n) return amountIn
    const wrappedNative = MAYAN_WRAPPED_NATIVE_ADDRESSES[input.chain]
    if (!wrappedNative) return amountIn
    return (
      findWrappedNativeWithdrawalBefore(
        input.txLogs,
        input.log.logIndex,
        wrappedNative,
      ) ?? amountIn
    )
  }

  if (normalized.kind === 'ForwardedERC20') {
    return decodedData.amountIn ?? normalized.amountInFromEvent
  }

  return normalized.amountInFromEvent
}

function findWrappedNativeWithdrawalBefore(
  logs: LogToCapture['txLogs'],
  targetLogIndex: number | null,
  wrappedNative: EthereumAddress,
): bigint | undefined {
  if (targetLogIndex === null) return
  for (let i = logs.length - 1; i >= 0; i--) {
    const candidate = logs[i]
    if (candidate.logIndex === null || candidate.logIndex >= targetLogIndex) {
      continue
    }
    if (EthereumAddress(candidate.address) !== wrappedNative) continue
    const withdrawal = parseWethWithdrawal(candidate, null)
    if (withdrawal) return withdrawal.wad
  }
}

function inferSrcWasBurned(
  input: LogToCapture,
  amountIn: bigint | undefined,
  tokenIn: Address32 | undefined,
): boolean | undefined {
  if (
    input.log.logIndex === null ||
    amountIn === undefined ||
    amountIn === 0n ||
    tokenIn === undefined
  ) {
    return undefined
  }
  if (tokenIn === Address32.NATIVE) {
    return false
  }

  const transfer = findBestTransferLog(
    input.txLogs,
    amountIn,
    input.log.logIndex,
  ).transfer
  if (!transfer) return undefined
  if (transfer.logAddress !== tokenIn) return undefined
  return isBurnAddress(transfer.to)
}

export function logToProtocolData(
  log: Log,
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
): DecodedData | undefined {
  const normalized = normalizeForwarderLog(log)
  if (!normalized) return
  const decoded = decodeProtocolData(
    normalized.protocolData,
    wormholeNetworks,
    [],
  )
  if (!decoded) return

  if (
    normalized.kind === 'SwapAndForwardedEth' ||
    normalized.kind === 'SwapAndForwardedERC20'
  ) {
    decoded.tokenIn = normalized.tokenInFromEvent
    decoded.amountIn = normalized.amountInFromEvent
  }
  return decoded
}

// Zero tokenOut means native token on destination
function tokenOutOrNative(tokenOut: string): Address32 {
  const addr = Address32.from(tokenOut)
  return addr === Address32.ZERO ? Address32.NATIVE : addr
}

function getChainFromWormholeId(
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  wormholeId: number,
) {
  return findChain(wormholeNetworks, (x) => x.wormholeChainId, wormholeId)
}

export function getChainFromCctpDomain(
  cctpNetworks: { chain: string; domain: number }[],
  domain: number,
) {
  return findChain(cctpNetworks, (x) => x.domain, domain)
}

const abiItems = parseAbi([
  // mayanSwift 0xC38e4e6A15593f908255214653d3D947CA1c2338
  'function createOrderWithToken(address tokenIn, uint256 amountIn, (bytes32 trader, bytes32 tokenOut, uint64 minAmountOut, uint64 gasDrop, uint64 cancelFee, uint64 refundFee, uint64 deadline, bytes32 dstAddress, uint16 destChainId, bytes32 referrerAddr, uint8 referrerBps, uint8 auctionMode, bytes32 random))',
  'function createOrderWithEth((bytes32 trader, bytes32 tokenOut, uint64 minAmountOut, uint64 gasDrop, uint64 cancelFee, uint64 refundFee, uint64 deadline, bytes32 dstAddress, uint16 destChainId, bytes32 referrerAddr, uint8 referrerBps, uint8 auctionMode, bytes32 random))',
  // mayanCircle 0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA
  'function createOrder((address tokenIn, uint256 amountIn, uint64 _a, bytes32 _b, uint16 destChain, bytes32 tokenOut, uint64 minAmountOut, uint64 _c, uint64 _d, bytes32 _e, uint8 _f))',
  'function bridgeWithFee(address tokenIn, uint256 amountIn, uint64 redeemFee, uint64 gasDrop, bytes32 destAddr, uint32 destDomain, uint8 payloadType, bytes customPayload) returns (uint64 sequence)', // 0x2072197f
  'function bridgeWithLockedFee(address tokenIn, uint256 amountIn, uint64 gasDrop, uint256 redeemFee, uint32 destDomain, bytes32 destAddr)',
  // fastMCTP 0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741
  'function createOrder(address tokenIn, uint256 amountIn, uint256 circleMaxFee, uint32 destDomain, uint32 minFinalityThreshold, (uint8 payloadType, bytes32 destAddr, bytes32 tokenOut, uint64 amountOutMin, uint64 gasDrop, uint64 redeemFee, uint64 refundFee, uint64 deadline, bytes32 referrerAddr, uint8 referrerBps))',
  'function bridge(address tokenIn, uint256 amountIn, uint64 redeemFee, uint256 circleMaxFee, uint64 gasDrop, bytes32 destAddr, uint32 destDomain, bytes32 referrerAddress, uint8 referrerBps, uint8 payloadType, uint32 minFinalityThreshold, bytes memory customPayload)',
  // mayanSwap 0xBF5f3f65102aE745A48BD521d10BaB5BF02A9eF4
  'function swap((uint64 swapFee, uint64 redeemFee, uint64 refundFee), (bytes32, uint16 mayanChainId, bytes32, bytes32 destAddr, uint16 destChainId, bytes32 referrer, bytes32 refundAddr), bytes32 tokenOutAddr, uint16 tokenOutChainId, (uint256 transferDeadline, uint64 swapDeadline, uint64 amountOutMin, bool unwrap, uint64 gasDrop, bytes customPayload), address tokenIn, uint256 amountIn)',
  'function wrapAndSwapETH((uint64 swapFee, uint64 redeemFee, uint64 refundFee), (bytes32, uint16 mayanChainId, bytes32, bytes32 destAddr, uint16 destChainId, bytes32, bytes32), bytes32 tokenOutAddr, uint16 tokenOutChainId, (uint256 transferDeadline, uint64 swapDeadline, uint64 amountOutMin, bool unwrap, uint64 gasDrop, bytes customPayload))',
  // mayanSwap2
])

const SELECTOR_CREATE_ORDER_WITH_TOKEN = '0x8e8d142b'
const SELECTOR_CREATE_ORDER_WITH_ETH = '0xb866e173'
const SELECTOR_CREATE_ORDER_MAYAN_CIRCLE = '0x1c59b7fc'
const SELECTOR_BRIDGE_WITH_FEE = '0x2072197f'
const SELECTOR_BRIDGE_WITH_LOCKED_FEE = '0x9be95bb4'
const SELECTOR_CREATE_ORDER_FAST_MCTP = '0x2337e236'
const SELECTOR_BRIDGE_FAST_MCTP = '0xf58b6de8'
const SELECTOR_SWAP = '0x6111ad25'
const SELECTOR_WRAP_AND_SWAP_ETH = '0x1eb1cff0'

interface DecodedData {
  functionName: string
  methodSignature: `0x${string}`
  args: unknown
  dstChain: string
  tokenIn?: Address32
  amountIn?: bigint
  tokenOut?: Address32
  minAmountOut?: bigint
}

function decodeProtocolData(
  data: `0x${string}`,
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  cctpNetworks: { chain: string; domain: number }[],
): DecodedData | undefined {
  const decoded: DecodedData = {
    functionName: 'unknown',
    methodSignature: data.slice(0, 10) as `0x${string}`,
    args: [],
    dstChain: 'unknown',
  }
  let res
  try {
    res = decodeFunctionData({
      abi: abiItems,
      data: data,
    })
  } catch {
    return undefined
  }

  decoded.functionName = res.functionName
  decoded.args = res.args
  switch (decoded.methodSignature) {
    case SELECTOR_CREATE_ORDER_WITH_TOKEN: {
      if (res.functionName !== 'createOrderWithToken') return decoded
      decoded.dstChain = getChainFromWormholeId(
        wormholeNetworks,
        res.args[2].destChainId,
      )
      decoded.tokenIn = Address32.from(res.args[0])
      decoded.amountIn = res.args[1]
      decoded.tokenOut = tokenOutOrNative(res.args[2].tokenOut)
      decoded.minAmountOut = res.args[2].minAmountOut
      return decoded
    }
    case SELECTOR_CREATE_ORDER_WITH_ETH: {
      if (res.functionName !== 'createOrderWithEth') return decoded
      decoded.dstChain = getChainFromWormholeId(
        wormholeNetworks,
        res.args[0].destChainId,
      )
      decoded.tokenIn = Address32.NATIVE
      decoded.tokenOut = tokenOutOrNative(res.args[0].tokenOut)
      decoded.minAmountOut = res.args[0].minAmountOut
      return decoded
    }
    case SELECTOR_CREATE_ORDER_MAYAN_CIRCLE: {
      if (res.functionName !== 'createOrder') return decoded
      const args = res.args as unknown as readonly [
        {
          tokenIn: `0x${string}`
          amountIn: bigint
          destChain: number
          tokenOut: `0x${string}`
          minAmountOut: bigint
        },
      ]
      decoded.dstChain = getChainFromWormholeId(
        wormholeNetworks,
        args[0].destChain,
      )
      decoded.tokenIn = Address32.from(args[0].tokenIn)
      decoded.amountIn = args[0].amountIn
      decoded.tokenOut = tokenOutOrNative(args[0].tokenOut)
      decoded.minAmountOut = args[0].minAmountOut
      return decoded
    }
    case SELECTOR_CREATE_ORDER_FAST_MCTP: {
      if (res.functionName !== 'createOrder') return decoded
      const args = res.args as unknown as readonly [
        `0x${string}`,
        bigint,
        bigint,
        number,
        number,
        {
          tokenOut: `0x${string}`
          amountOutMin: bigint
        },
      ]
      decoded.dstChain = getChainFromCctpDomain(cctpNetworks, args[3])
      decoded.tokenIn = Address32.from(args[0])
      decoded.amountIn = args[1]
      decoded.tokenOut = tokenOutOrNative(args[5].tokenOut)
      decoded.minAmountOut = args[5].amountOutMin
      return decoded
    }
    case SELECTOR_BRIDGE_WITH_FEE: {
      if (res.functionName !== 'bridgeWithFee') return decoded
      decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[5])
      decoded.tokenIn = Address32.from(res.args[0])
      decoded.amountIn = res.args[1]
      return decoded
    }
    case SELECTOR_BRIDGE_WITH_LOCKED_FEE: {
      if (res.functionName !== 'bridgeWithLockedFee') return decoded
      decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[4])
      decoded.tokenIn = Address32.from(res.args[0])
      decoded.amountIn = res.args[1]
      return decoded
    }
    case SELECTOR_BRIDGE_FAST_MCTP: {
      if (res.functionName !== 'bridge') return decoded
      decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[6])
      decoded.tokenIn = Address32.from(res.args[0])
      decoded.amountIn = res.args[1]
      return decoded
    }
    case SELECTOR_SWAP: {
      if (res.functionName !== 'swap') return decoded
      decoded.dstChain = getChainFromWormholeId(wormholeNetworks, res.args[3])
      decoded.tokenIn = Address32.from(res.args[5])
      decoded.amountIn = res.args[6]
      decoded.tokenOut = tokenOutOrNative(res.args[2])
      decoded.minAmountOut = res.args[4].amountOutMin
      return decoded
    }
    case SELECTOR_WRAP_AND_SWAP_ETH: {
      if (res.functionName !== 'wrapAndSwapETH') return decoded
      decoded.dstChain = getChainFromWormholeId(wormholeNetworks, res.args[3])
      decoded.tokenIn = Address32.NATIVE
      decoded.tokenOut = tokenOutOrNative(res.args[2])
      decoded.minAmountOut = res.args[4].amountOutMin
      return decoded
    }
    default:
      return decoded
  }
}
