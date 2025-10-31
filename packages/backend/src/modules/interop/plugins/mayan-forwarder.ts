/*
Mayan Forwarder
- chooses one of the Mayan protocol
- emits Event that will allow further matching
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeFunctionData, type Log, parseAbi } from 'viem'
import {
  Address32,
  createEventParser,
  createInteropEventType,
  findChain,
  type InteropPlugin,
  type LogToCapture,
} from './types'
import { WORMHOLE_NETWORKS } from './wormhole'

const MAYAN_PROTOCOLS = [
  {
    chain: 'ethereum',
    protocols: {
      mayanSwift: EthereumAddress('0xC38e4e6A15593f908255214653d3D947CA1c2338'),
      mayanSwap: EthereumAddress('0xBF5f3f65102aE745A48BD521d10BaB5BF02A9eF4'), // unverified, less used
      fastMCTP: EthereumAddress('0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741'),
      mayanCircle: EthereumAddress(
        '0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA',
      ),
      mayanSwap2: EthereumAddress('0x238856DE6d9d32EA3Dd4e9e7dbfe08b23cD5048c'), // unverified
    },
  },
  {
    chain: 'base',
    protocols: {
      mayanSwift: EthereumAddress('0xC38e4e6A15593f908255214653d3D947CA1c2338'),
      fastMCTP: EthereumAddress('0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741'),
      mayanCircle: EthereumAddress(
        '0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA',
      ),
      mayanSwap2: EthereumAddress('0x238856DE6d9d32EA3Dd4e9e7dbfe08b23cD5048c'), // unverified
    },
  },
  {
    chain: 'arbitrum',
    protocols: {
      mayanSwift: EthereumAddress('0xC38e4e6A15593f908255214653d3D947CA1c2338'),
      fastMCTP: EthereumAddress('0xC1062b7C5Dc8E4b1Df9F200fe360cDc0eD6e7741'),
      mayanCircle: EthereumAddress(
        '0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA',
      ),
      mayanSwap2: EthereumAddress('0x238856DE6d9d32EA3Dd4e9e7dbfe08b23cD5048c'), // unverified
    },
  },
]

export const parseForwardedEth = createEventParser(
  'event ForwardedEth(address mayanProtocol, bytes protocolData)',
)

export const parseForwardedERC20 = createEventParser(
  'event ForwardedERC20(address token, uint256 amount, address mayanProtocol, bytes protocolData)',
)

export const parseSwapAndForwardedEth = createEventParser(
  'event SwapAndForwardedEth(uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

export const parseSwapAndForwardedERC20 = createEventParser(
  'event SwapAndForwardedERC20(address tokenIn, uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

export const MayanForwarded = createInteropEventType<{
  mayanProtocol: string
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: string
  tokenOut?: Address32
  minAmountOut?: string
  $dstChain: string
}>('mayan-forwarder.MayanForwarded')

export class MayanForwarderPlugin implements InteropPlugin {
  name = 'mayan-forwarder'

  capture(input: LogToCapture) {
    const forwardedEth = parseForwardedEth(input.log, null)
    if (forwardedEth) {
      const decodedData = decodeProtocolData(forwardedEth.protocolData)
      if (!decodedData) return
      return [
        MayanForwarded.create(input.ctx, {
          mayanProtocol: decodeMayanProtocol(
            input.ctx.chain,
            forwardedEth.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.NATIVE,
          amountIn: decodedData.amountIn ?? input.ctx.txValue?.toString(),
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    const forwardedERC20 = parseForwardedERC20(input.log, null)
    if (forwardedERC20) {
      const decodedData = decodeProtocolData(forwardedERC20.protocolData)
      if (!decodedData) return
      return [
        MayanForwarded.create(input.ctx, {
          mayanProtocol: decodeMayanProtocol(
            input.ctx.chain,
            forwardedERC20.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.from(forwardedERC20.token),
          amountIn: decodedData.amountIn ?? forwardedERC20.amount.toString(),
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    const swapAndForwardedEth = parseSwapAndForwardedEth(input.log, null)
    if (swapAndForwardedEth) {
      const decodedData = decodeProtocolData(swapAndForwardedEth.mayanData)
      if (!decodedData) return
      return [
        MayanForwarded.create(input.ctx, {
          mayanProtocol: decodeMayanProtocol(
            input.ctx.chain,
            swapAndForwardedEth.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.ZERO,
          amountIn: decodedData.amountIn ?? '0',
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    const swapAndForwardedERC20 = parseSwapAndForwardedERC20(input.log, null)
    if (swapAndForwardedERC20) {
      const decodedData = decodeProtocolData(swapAndForwardedERC20.mayanData)
      if (!decodedData) return
      return [
        MayanForwarded.create(input.ctx, {
          mayanProtocol: decodeMayanProtocol(
            input.ctx.chain,
            swapAndForwardedERC20.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.ZERO,
          amountIn: decodedData.amountIn ?? '0',
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }
  }
}

export function logToProtocolData(log: Log): DecodedData | undefined {
  const parsed1 = parseForwardedEth(log, null) ?? parseForwardedERC20(log, null)
  if (parsed1) {
    return decodeProtocolData(parsed1.protocolData)
  }
  const parsed2 =
    parseSwapAndForwardedERC20(log, null) ?? parseSwapAndForwardedEth(log, null)
  if (parsed2) {
    return decodeProtocolData(parsed2.mayanData)
  }
}

function decodeMayanProtocol(chain: string, protocolAddress: string) {
  const protocols = MAYAN_PROTOCOLS.find((p) => p.chain === chain)?.protocols
  if (!protocols) return `unknown_chain_${chain}`
  return (
    Object.entries(protocols).find(
      ([, address]) => address === protocolAddress,
    )?.[0] ?? `unknown_protocol_${protocolAddress}_on_${chain}`
  )
}

function getChainFromWormholeId(wormholeId: number) {
  return findChain(WORMHOLE_NETWORKS, (x) => x.wormholeChainId, wormholeId)
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

interface DecodedData {
  functionName: string
  methodSignature: `0x${string}`
  args: unknown
  dstChain: string
  tokenIn?: Address32
  amountIn?: string
  tokenOut?: Address32
  minAmountOut?: string
}

function decodeProtocolData(data: `0x${string}`): DecodedData | undefined {
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

  if (res.functionName === 'createOrderWithToken') {
    decoded.dstChain = getChainFromWormholeId(res.args[2].destChainId)
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1].toString()
    decoded.tokenOut = Address32.from(res.args[2].tokenOut)
    decoded.minAmountOut = res.args[2].minAmountOut.toString()
  } else if (res.functionName === 'createOrderWithEth') {
    decoded.dstChain = getChainFromWormholeId(res.args[0].destChainId)
    decoded.tokenIn = Address32.NATIVE
    decoded.tokenOut = Address32.from(res.args[0].tokenOut)
    decoded.minAmountOut = res.args[0].minAmountOut.toString()
  } else if (res.functionName === 'createOrder') {
    if (res.args.length === 1) {
      decoded.dstChain = getChainFromWormholeId(res.args[0].destChain)
      decoded.tokenIn = Address32.from(res.args[0].tokenIn)
      decoded.amountIn = res.args[0].amountIn.toString()
      decoded.tokenOut = Address32.from(res.args[0].tokenOut)
      decoded.minAmountOut = res.args[0].minAmountOut.toString()
    } else {
      decoded.dstChain = getChainFromWormholeId(res.args[4])
      decoded.tokenIn = Address32.from(res.args[0])
      decoded.amountIn = res.args[1].toString()
      decoded.tokenOut = Address32.from(res.args[5].tokenOut)
      decoded.minAmountOut = res.args[5].amountOutMin.toString()
    }
  } else if (res.functionName === 'bridgeWithFee') {
    decoded.dstChain = getChainFromWormholeId(res.args[5])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1].toString()
  } else if (res.functionName === 'bridgeWithLockedFee') {
    decoded.dstChain = getChainFromWormholeId(res.args[4])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1].toString()
  } else if (res.functionName === 'bridge') {
    decoded.dstChain = getChainFromWormholeId(res.args[6])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1].toString()
  } else if (res.functionName === 'swap') {
    decoded.dstChain = getChainFromWormholeId(res.args[3])
    decoded.tokenIn = Address32.from(res.args[5])
    decoded.amountIn = res.args[6].toString()
    decoded.tokenOut = Address32.from(res.args[2])
    decoded.minAmountOut = res.args[4].amountOutMin.toString()
  } else if (res.functionName === 'wrapAndSwapETH') {
    decoded.dstChain = getChainFromWormholeId(res.args[3])
    decoded.tokenIn = Address32.NATIVE
    decoded.tokenOut = Address32.from(res.args[2])
    decoded.minAmountOut = res.args[4].amountOutMin.toString()
  }
  return decoded
}
