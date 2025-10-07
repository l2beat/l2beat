/*
Mayan Forwarder
- chooses one of the Mayan protocol
- emits Event that will allow further matching
*/

import { EthereumAddress } from '@l2beat/shared-pure'
import { decodeFunctionData, parseAbi } from 'viem'
import {
  type BridgePlugin,
  createBridgeEventType,
  createEventParser,
  findChain,
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

const abi = [
  // mayanSwift 0xC38e4e6A15593f908255214653d3D947CA1c2338
  'function createOrderWithToken(address,uint256,(bytes32 trader,bytes32 tokenOut,uint64 minAmountOut,uint64 gasDrop,uint64 cancelFee,uint64 refundFee,uint64 deadline,bytes32 dstAddress,uint16 destChainId,bytes32 referrerAddr,uint8 referrerBps,uint8 auctionMode,bytes32 random))',
  'function createOrderWithEth((bytes32,bytes32,uint64,uint64,uint64,uint64,uint64,bytes32,uint16 destChainId,bytes32,uint8,uint8,bytes32))',
  // mayanCircle 0x875d6d37EC55c8cF220B9E5080717549d8Aa8EcA
  'function createOrder((address tokenIn,uint256 amountIn,uint64,bytes32,uint16 destChain,bytes32 tokenOut,uint64 minAmountOut,uint64,uint64,bytes32,uint8))',
  'function bridgeWithFee(address tokenIn,uint256 amountIn,uint64 redeemFee,uint64 gasDrop,bytes32 destAddr,uint32 destDomain,uint8 payloadType,bytes customPayload) returns (uint64 sequence)', // 0x2072197f
  'function bridgeWithLockedFee(address tokenIn,uint256 amountIn,uint64,uint256,uint32 destDomain,bytes32)',
  // fastMCTP
  'function createOrder(address,uint256,uint256,uint32,uint32,(uint8,bytes32,bytes32,uint64,uint64,uint64,uint64,uint64,bytes32,uint8))',
  'function bridge(address tokenIn,uint256 amountIn,uint64,uint256,uint64,bytes32,uint32 destDomain,bytes32,uint8,uint8,uint32,bytes)',
  // mayanSwap
  'function swap((uint64,uint64,uint64),(bytes32,uint16,bytes32,bytes32,uint16,bytes32,bytes32),bytes32 tokenOutChainId,uint16 tokenOutChainId,(uint256,uint64,uint64,bool,uint64,bytes),address tokenIn,uint256 tokenIn)',
  'function wrapAndSwapETH((uint64,uint64,uint64),(bytes32,uint16,bytes32,bytes32,uint16,bytes32,bytes32),bytes32 tokenOutAddr,uint16 tokenOutChainId,(uint256,uint64,uint64,bool,uint64,bytes))',
  // mayanSwap2
]

const abiItems = parseAbi(abi)

export const parseForwardedEth = createEventParser(
  'event ForwardedEth(address mayanProtocol, bytes protocolData)',
)

export const parseForwardedERC20 = createEventParser(
  'event ForwardedERC20(address token, uint256 amount, address mayanProtocol, bytes protocolData)',
)

export const swapAndForwardedEth = createEventParser(
  'event SwapAndForwardedEth(uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

export const swapAndForwardedERC20 = createEventParser(
  'event SwapAndForwardedERC20(address tokenIn, uint256 amountIn, address swapProtocol, address middleToken, uint256 middleAmount, address mayanProtocol, bytes mayanData)',
)

export const ForwardedEth = createBridgeEventType<{
  mayanProtocol: string
  $dstChain: string
  protocolData: `0x${string}`
}>('mayan-forwarder.ForwardedEth')

export const ForwardedERC20 = createBridgeEventType<{
  mayanProtocol: string
  $dstChain: string
  protocolData: `0x${string}`
}>('mayan-forwarder.ForwardedERC20')

export const SwapAndForwardedEth = createBridgeEventType<{
  mayanProtocol: string
  $dstChain: string
  protocolData: `0x${string}`
}>('mayan-forwarder.SwapAndForwardedEth')

export const SwapAndForwardedERC20 = createBridgeEventType<{
  mayanProtocol: string
  $dstChain: string
  protocolData: `0x${string}`
}>('mayan-forwarder.SwapAndForwardedERC20')

export class MayanForwarderPlugin implements BridgePlugin {
  name = 'mayan-forwarder'

  capture(event: LogToCapture) {
    const forwardedEth = parseForwardedEth(event.log, null)
    if (forwardedEth) {
      const decodedData = decodeProtocolData(forwardedEth.protocolData)
      return ForwardedEth.create(event.ctx, {
        mayanProtocol: decodeMayanProtocol(
          event.ctx.chain,
          forwardedEth.mayanProtocol,
        ),
        protocolData: forwardedEth.protocolData,
        $dstChain: decodedData.dstChain,
      })
    }

    const forwardedERC20 = parseForwardedERC20(event.log, null)
    if (forwardedERC20) {
      const decodedData = decodeProtocolData(forwardedERC20.protocolData)
      return ForwardedERC20.create(event.ctx, {
        mayanProtocol: decodeMayanProtocol(
          event.ctx.chain,
          forwardedERC20.mayanProtocol,
        ),
        protocolData: forwardedERC20.protocolData,
        $dstChain: decodedData.dstChain,
      })
    }

    const swapAndForwardedEthEvent = swapAndForwardedEth(event.log, null)
    if (swapAndForwardedEthEvent) {
      const decodedData = decodeProtocolData(swapAndForwardedEthEvent.mayanData)
      return SwapAndForwardedEth.create(event.ctx, {
        mayanProtocol: decodeMayanProtocol(
          event.ctx.chain,
          swapAndForwardedEthEvent.mayanProtocol,
        ),
        protocolData: swapAndForwardedEthEvent.mayanData,
        $dstChain: decodedData.dstChain,
      })
    }

    const swapAndForwardedERC20Event = swapAndForwardedERC20(event.log, null)
    if (swapAndForwardedERC20Event) {
      const decodedData = decodeProtocolData(
        swapAndForwardedERC20Event.mayanData,
      )
      return SwapAndForwardedERC20.create(event.ctx, {
        mayanProtocol: decodeMayanProtocol(
          event.ctx.chain,
          swapAndForwardedERC20Event.mayanProtocol,
        ),
        protocolData: swapAndForwardedERC20Event.mayanData,
        $dstChain: decodedData.dstChain,
      })
    }
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

type OrderInfo = {
  trader: string
  tokenOut: string
  minAmountOut: bigint
  gasDrop: bigint
  cancelFee: bigint
  refundFee: bigint
  deadline: bigint
  dstAddress: string
  destChainId: number
  referrerAddr: string
  referrerBps: number
  auctionMode: number
  random: string
}

function decodeProtocolData(data: `0x${string}`) {
  const { functionName, args } = decodeFunctionData({
    abi: abiItems,
    data: data,
  })
  if (args) {
    let dstChain = 'unknown'
    switch (functionName) {
      case 'createOrderWithToken':
        dstChain = getChainFromWormholeId((args[2] as OrderInfo).destChainId)
        break
      case 'createOrderWithEth':
        dstChain = getChainFromWormholeId(args[8] as number)
        break
      case 'createOrder':
        dstChain = getChainFromWormholeId(args[4] as number)
        break
      case 'bridgeWithFee':
        dstChain = getChainFromWormholeId(args[5] as number)
        break
      case 'bridgeWithLockedFee':
        dstChain = getChainFromWormholeId(args[4] as number)
        break
      case 'bridge':
        dstChain = getChainFromWormholeId(args[6] as number)
        break
      case 'swap':
        dstChain = getChainFromWormholeId(args[3] as number)
        break
      case 'wrapAndSwapETH':
        dstChain = getChainFromWormholeId(args[3] as number)
        break
      default:
        dstChain = `unknown_from_function_${functionName}`
        break
    }
    return { functionName, args, dstChain }
  }
  return { functionName: 'unknown', args: null, dstChain: 'unknown' }
}
