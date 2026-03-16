/*
Mayan Forwarder emits a source-side summary for Mayan protocol calls.
ForwardedEth can arrive through wrappers, so outer tx.value may be zero even when ETH was forwarded.
*/

import { Address32, EthereumAddress } from '@l2beat/shared-pure'
import {
  decodeAbiParameters,
  decodeFunctionData,
  type Log,
  parseAbi,
  parseAbiParameters,
} from 'viem'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV1Config, CCTPV2Config } from './cctp/cctp.config'
import {
  MAYAN_EVM_CHAINS,
  MAYAN_FORWARDER,
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
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
  tokenOut?: Address32
  $dstChain: string
}>('mayan-forwarder.MayanForwarded')

interface NormalizedForwarderLog {
  protocolData: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
}

export class MayanForwarderPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-forwarder'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const forwarderAddresses = toChainSpecificAddresses(
      MAYAN_EVM_CHAINS,
      MAYAN_FORWARDER,
    )

    return [
      {
        type: 'event',
        signature: forwardedEthLog,
        includeTx: true,
        includeTxEvents: [wethWithdrawalLog],
        addresses: forwarderAddresses,
      },
      {
        type: 'event',
        signature: forwardedERC20Log,
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

    const parsed = parseForwarderLog(input.log)
    if (!parsed) return

    const decodedData = decodeMayanData(
      parsed.protocolData,
      wormholeNetworks,
      cctpNetworks,
    )
    if (!decodedData) return

    const tokenIn = parsed.tokenIn
    const amountIn = parsed.amountIn ?? resolveForwardedEthAmount(input)

    return [
      MayanForwarded.create(input, {
        methodSignature: decodedData.methodSignature,
        tokenIn,
        amountIn,
        tokenOut: decodedData.tokenOut,
        $dstChain: decodedData.dstChain,
      }),
    ]
  }
}

function parseForwarderLog(log: Log): NormalizedForwarderLog | undefined {
  const forwardedEth = parseForwardedEth(log, null)
  if (forwardedEth) {
    return {
      protocolData: forwardedEth.protocolData,
      tokenIn: Address32.NATIVE,
    }
  }

  const forwardedERC20 = parseForwardedERC20(log, null)
  if (forwardedERC20) {
    return {
      protocolData: forwardedERC20.protocolData,
      tokenIn: Address32.from(forwardedERC20.token),
      amountIn: forwardedERC20.amount,
    }
  }

  const swapAndForwardedEth = parseSwapAndForwardedEth(log, null)
  if (swapAndForwardedEth) {
    return {
      protocolData: swapAndForwardedEth.mayanData,
      tokenIn: Address32.from(swapAndForwardedEth.middleToken),
      amountIn: swapAndForwardedEth.middleAmount,
    }
  }

  const swapAndForwardedERC20 = parseSwapAndForwardedERC20(log, null)
  if (swapAndForwardedERC20) {
    return {
      protocolData: swapAndForwardedERC20.mayanData,
      tokenIn: zeroAddressToNative(swapAndForwardedERC20.middleToken),
      amountIn: swapAndForwardedERC20.middleAmount,
    }
  }
}

function resolveForwardedEthAmount(input: LogToCapture): bigint | undefined {
  return findNativeAmountInTx(input, [MAYAN_FORWARDER])
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

// CALLDATA decoding for AA support

const executeAbi = parseAbi([
  'function execute(bytes32 mode, bytes executionData)',
])
const executeBatchParams = parseAbiParameters('bytes[]')
const executeCallParams = parseAbiParameters(
  '(address to, uint256 value, bytes data)[]',
)

export function findNativeAmountInTx(
  input: Pick<LogToCapture, 'tx' | 'txLogs' | 'log' | 'chain'>,
  targets: EthereumAddress[],
): bigint | undefined {
  const txValue = input.tx.value
  if (txValue !== undefined && txValue > 0n) return txValue

  const nestedValue = findExecuteCallValue(
    typeof input.tx.data === 'string'
      ? (input.tx.data as `0x${string}`)
      : undefined,
    targets,
  )
  if (nestedValue !== undefined && nestedValue > 0n) return nestedValue

  const wrappedNative = MAYAN_WRAPPED_NATIVE_ADDRESSES[input.chain]
  if (!wrappedNative) return undefined

  return findWrappedNativeWithdrawalBefore(
    input.txLogs,
    input.log.logIndex,
    wrappedNative,
  )
}

function findExecuteCallValue(
  txData: `0x${string}` | undefined,
  targets: EthereumAddress[],
): bigint | undefined {
  if (!txData) return

  let decoded
  try {
    decoded = decodeFunctionData({
      abi: executeAbi,
      data: txData,
    })
  } catch {
    return undefined
  }

  if (decoded.functionName !== 'execute') return undefined

  const calls = decodeExecuteCalls(decoded.args[0], decoded.args[1])
  const targetSet = new Set(targets.map((target) => target.toLowerCase()))

  const directMatch = calls.find(
    (call) => call.value > 0n && targetSet.has(call.to.toLowerCase()),
  )
  if (directMatch) return directMatch.value

  const positiveCalls = calls.filter((call) => call.value > 0n)
  if (positiveCalls.length === 1) return positiveCalls[0].value

  return undefined
}

function decodeExecuteCalls(
  mode: `0x${string}`,
  executionData: `0x${string}`,
): Array<{ to: `0x${string}`; value: bigint }> {
  const modeId = mode.slice(0, 22)

  if (modeId === '0x01000000000078210002') {
    const [batches] = decodeAbiParameters(executeBatchParams, executionData)
    return batches.flatMap((batch) => decodeExecuteCalls(mode, batch))
  }

  if (
    modeId !== '0x01000000000000000000' &&
    modeId !== '0x01000000000078210001'
  ) {
    return []
  }

  const [calls] = decodeAbiParameters(executeCallParams, executionData)
  return calls.map((call) => ({ to: call.to, value: call.value }))
}

export function logToProtocolData(
  log: Log,
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
): DecodedData | undefined {
  const parsed = parseForwarderLog(log)
  if (!parsed) return
  const decoded = decodeMayanData(parsed.protocolData, wormholeNetworks, [])
  if (!decoded) return

  decoded.tokenIn = parsed.tokenIn
  if (parsed.amountIn !== undefined) decoded.amountIn = parsed.amountIn
  return decoded
}

function zeroAddressToNative(address: string): Address32 {
  const addr = Address32.from(address)
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
  'function createOrderWithToken(address tokenIn, uint256 amountIn, (uint8 traderType, bytes32 trader, bytes32 dstAddress, uint16 destChainId, bytes32 referrerAddr, bytes32 tokenOut, uint64 minAmountOut, uint64 gasDrop, uint64 cancelFee, uint64 refundFee, uint64 deadline, uint8 referrerBps, uint8 auctionMode, bytes32 random), bytes customPayload)',
  'function createOrderWithEth((bytes32 trader, bytes32 tokenOut, uint64 minAmountOut, uint64 gasDrop, uint64 cancelFee, uint64 refundFee, uint64 deadline, bytes32 dstAddress, uint16 destChainId, bytes32 referrerAddr, uint8 referrerBps, uint8 auctionMode, bytes32 random))',
  'function createOrderWithSig(address tokenIn, uint256 amountIn, (bytes32 trader, bytes32 tokenOut, uint64 minAmountOut, uint64 gasDrop, uint64 cancelFee, uint64 refundFee, uint64 deadline, bytes32 dstAddress, uint16 destChainId, bytes32 referrerAddr, uint8 referrerBps, uint8 auctionMode, bytes32 random), uint256 submissionFee, bytes signedOrderHash, (uint256 value, uint256 deadline, uint8 v, bytes32 r, bytes32 s))',
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
const SELECTOR_CREATE_ORDER_WITH_TOKEN_V2 = '0xa3a30834'
const SELECTOR_CREATE_ORDER_WITH_ETH = '0xb866e173'
const SELECTOR_CREATE_ORDER_WITH_SIG = '0x3a30b37f'
const SELECTOR_CREATE_ORDER_MAYAN_CIRCLE = '0x1c59b7fc'
const SELECTOR_BRIDGE_WITH_FEE = '0x2072197f'
const SELECTOR_BRIDGE_WITH_LOCKED_FEE = '0x9be95bb4'
const SELECTOR_CREATE_ORDER_FAST_MCTP = '0x2337e236'
const SELECTOR_BRIDGE_FAST_MCTP = '0xf58b6de8'
const SELECTOR_SWAP = '0x6111ad25'
const SELECTOR_WRAP_AND_SWAP_ETH = '0x1eb1cff0'

interface DecodedData {
  methodSignature: `0x${string}`
  dstChain: string
  tokenIn?: Address32
  amountIn?: bigint
  tokenOut?: Address32
}

export function decodeMayanData(
  data: `0x${string}`,
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  cctpNetworks: { chain: string; domain: number }[],
): DecodedData | undefined {
  const methodSignature = data.slice(0, 10) as `0x${string}`
  let res
  try {
    res = decodeFunctionData({
      abi: abiItems,
      data: data,
    })
  } catch {
    return undefined
  }

  switch (methodSignature) {
    case SELECTOR_CREATE_ORDER_WITH_TOKEN: {
      if (res.functionName !== 'createOrderWithToken') return
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(
          wormholeNetworks,
          res.args[2].destChainId,
        ),
        tokenIn: Address32.from(res.args[0]),
        amountIn: res.args[1],
        tokenOut: zeroAddressToNative(res.args[2].tokenOut),
      }
    }
    case SELECTOR_CREATE_ORDER_WITH_TOKEN_V2: {
      if (res.functionName !== 'createOrderWithToken') return
      const args = res.args as unknown as readonly [
        `0x${string}`,
        bigint,
        {
          destChainId: number
          tokenOut: `0x${string}`
        },
        `0x${string}`,
      ]
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(wormholeNetworks, args[2].destChainId),
        tokenIn: zeroAddressToNative(args[0]),
        amountIn: args[1],
        tokenOut: zeroAddressToNative(args[2].tokenOut),
      }
    }
    case SELECTOR_CREATE_ORDER_WITH_ETH: {
      if (res.functionName !== 'createOrderWithEth') return
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(
          wormholeNetworks,
          res.args[0].destChainId,
        ),
        tokenIn: Address32.NATIVE,
        tokenOut: zeroAddressToNative(res.args[0].tokenOut),
      }
    }
    case SELECTOR_CREATE_ORDER_WITH_SIG: {
      if (res.functionName !== 'createOrderWithSig') return
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(
          wormholeNetworks,
          res.args[2].destChainId,
        ),
        tokenIn: Address32.from(res.args[0]),
        amountIn: res.args[1],
        tokenOut: zeroAddressToNative(res.args[2].tokenOut),
      }
    }
    case SELECTOR_CREATE_ORDER_MAYAN_CIRCLE: {
      if (res.functionName !== 'createOrder') return
      const args = res.args as unknown as readonly [
        {
          tokenIn: `0x${string}`
          amountIn: bigint
          destChain: number
          tokenOut: `0x${string}`
          minAmountOut: bigint
        },
      ]
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(wormholeNetworks, args[0].destChain),
        tokenIn: Address32.from(args[0].tokenIn),
        amountIn: args[0].amountIn,
        tokenOut: zeroAddressToNative(args[0].tokenOut),
      }
    }
    case SELECTOR_CREATE_ORDER_FAST_MCTP: {
      if (res.functionName !== 'createOrder') return
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
      return {
        methodSignature,
        dstChain: getChainFromCctpDomain(cctpNetworks, args[3]),
        tokenIn: Address32.from(args[0]),
        amountIn: args[1],
        tokenOut: zeroAddressToNative(args[5].tokenOut),
      }
    }
    case SELECTOR_BRIDGE_WITH_FEE: {
      if (res.functionName !== 'bridgeWithFee') return
      return {
        methodSignature,
        dstChain: getChainFromCctpDomain(cctpNetworks, res.args[5]),
        tokenIn: Address32.from(res.args[0]),
        amountIn: res.args[1],
      }
    }
    case SELECTOR_BRIDGE_WITH_LOCKED_FEE: {
      if (res.functionName !== 'bridgeWithLockedFee') return
      return {
        methodSignature,
        dstChain: getChainFromCctpDomain(cctpNetworks, res.args[4]),
        tokenIn: Address32.from(res.args[0]),
        amountIn: res.args[1],
      }
    }
    case SELECTOR_BRIDGE_FAST_MCTP: {
      if (res.functionName !== 'bridge') return
      return {
        methodSignature,
        dstChain: getChainFromCctpDomain(cctpNetworks, res.args[6]),
        tokenIn: Address32.from(res.args[0]),
        amountIn: res.args[1],
      }
    }
    case SELECTOR_SWAP: {
      if (res.functionName !== 'swap') return
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(wormholeNetworks, res.args[3]),
        tokenIn: Address32.from(res.args[5]),
        amountIn: res.args[6],
        tokenOut: zeroAddressToNative(res.args[2]),
      }
    }
    case SELECTOR_WRAP_AND_SWAP_ETH: {
      if (res.functionName !== 'wrapAndSwapETH') return
      return {
        methodSignature,
        dstChain: getChainFromWormholeId(wormholeNetworks, res.args[3]),
        tokenIn: Address32.NATIVE,
        tokenOut: zeroAddressToNative(res.args[2]),
      }
    }
    default:
      return undefined
  }
}
