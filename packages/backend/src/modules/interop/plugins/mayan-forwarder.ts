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

import {
  Address32,
  ChainSpecificAddress,
  EthereumAddress,
} from '@l2beat/shared-pure'
import { decodeFunctionData, type Log, parseAbi } from 'viem'
import type { InteropConfigStore } from '../engine/config/InteropConfigStore'
import { CCTPV1Config, CCTPV2Config } from './cctp/cctp.config'
import {
  createEventParser,
  createInteropEventType,
  type DataRequest,
  findChain,
  type InteropPluginResyncable,
  type LogToCapture,
} from './types'
import { WormholeConfig } from './wormhole/wormhole.config'

// MayanForwarder contract address - same across all EVM chains
// https://docs.mayan.finance/integration/forwarder-contract
const MAYAN_FORWARDER = EthereumAddress(
  '0x337685fdab40d39bd02028545a4ffa7d287cc3e2',
)

// Chains where MayanForwarder is deployed
const MAYAN_FORWARDER_CHAINS = [
  'ethereum',
  'arbitrum',
  'base',
  'optimism',
  'polygonpos',
  'bsc',
  'avalanche',
]

// WETH/WMATIC addresses by chain
const WRAPPED_NATIVE_ADDRESSES: Record<string, EthereumAddress> = {
  ethereum: EthereumAddress('0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2'),
  base: EthereumAddress('0x4200000000000000000000000000000000000006'),
  arbitrum: EthereumAddress('0x82aF49447D8a07e3bd95BD0d56f35241523fBab1'),
  optimism: EthereumAddress('0x4200000000000000000000000000000000000006'),
  polygonpos: EthereumAddress('0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'), // WMATIC
}

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
  mayanProtocol: string
  methodSignature: `0x${string}`
  tokenIn: Address32
  amountIn?: bigint
  tokenOut?: Address32
  minAmountOut?: bigint
  $dstChain: string
}>('mayan-forwarder.MayanForwarded')

export class MayanForwarderPlugin implements InteropPluginResyncable {
  readonly name = 'mayan-forwarder'

  constructor(private configs: InteropConfigStore) {}

  getDataRequests(): DataRequest[] {
    const forwarderAddresses: ChainSpecificAddress[] = []
    for (const chain of MAYAN_FORWARDER_CHAINS) {
      try {
        forwarderAddresses.push(
          ChainSpecificAddress.fromLong(chain, MAYAN_FORWARDER),
        )
      } catch {
        // Chain not supported by ChainSpecificAddress, skip
      }
    }

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

    const forwardedEth = parseForwardedEth(input.log, null)
    if (forwardedEth) {
      const decodedData = decodeProtocolData(
        forwardedEth.protocolData,
        wormholeNetworks,
        cctpNetworks,
      )
      if (!decodedData) return

      // When tx.value is 0 (e.g., aggregator transactions via LiFi),
      // look for WETH Withdrawal event before ForwardedEth to get the ETH amount
      let amountIn = decodedData.amountIn ?? input.tx.value
      if (amountIn === 0n) {
        const wrappedNative = WRAPPED_NATIVE_ADDRESSES[input.chain]
        if (wrappedNative && input.log.logIndex !== null) {
          for (let i = input.log.logIndex - 1; i >= 0; i--) {
            const candidateLog = input.txLogs.find((log) => log.logIndex === i)
            if (!candidateLog) continue
            if (EthereumAddress(candidateLog.address) !== wrappedNative)
              continue
            const withdrawal = parseWethWithdrawal(candidateLog, null)
            if (withdrawal) {
              amountIn = withdrawal.wad
              break
            }
          }
        }
      }

      return [
        MayanForwarded.create(input, {
          mayanProtocol: decodeMayanProtocol(
            input.chain,
            forwardedEth.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.NATIVE,
          amountIn,
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    const forwardedERC20 = parseForwardedERC20(input.log, null)
    if (forwardedERC20) {
      const decodedData = decodeProtocolData(
        forwardedERC20.protocolData,
        wormholeNetworks,
        cctpNetworks,
      )
      if (!decodedData) return
      return [
        MayanForwarded.create(input, {
          mayanProtocol: decodeMayanProtocol(
            input.chain,
            forwardedERC20.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: decodedData.tokenIn ?? Address32.from(forwardedERC20.token),
          amountIn: decodedData.amountIn ?? forwardedERC20.amount,
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    // For SwapAndForwarded events, use tokenIn/amountIn from the event (user's actual tokens)
    // The protocolData contains the intermediate bridged token info, not the user's original tokens
    const swapAndForwardedEth = parseSwapAndForwardedEth(input.log, null)
    if (swapAndForwardedEth) {
      const decodedData = decodeProtocolData(
        swapAndForwardedEth.mayanData,
        wormholeNetworks,
        cctpNetworks,
      )
      if (!decodedData) return
      return [
        MayanForwarded.create(input, {
          mayanProtocol: decodeMayanProtocol(
            input.chain,
            swapAndForwardedEth.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: Address32.NATIVE,
          amountIn: swapAndForwardedEth.amountIn,
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }

    const swapAndForwardedERC20 = parseSwapAndForwardedERC20(input.log, null)
    if (swapAndForwardedERC20) {
      const decodedData = decodeProtocolData(
        swapAndForwardedERC20.mayanData,
        wormholeNetworks,
        cctpNetworks,
      )
      if (!decodedData) return
      return [
        MayanForwarded.create(input, {
          mayanProtocol: decodeMayanProtocol(
            input.chain,
            swapAndForwardedERC20.mayanProtocol,
          ),
          methodSignature: decodedData.methodSignature,
          tokenIn: Address32.from(swapAndForwardedERC20.tokenIn),
          amountIn: swapAndForwardedERC20.amountIn,
          tokenOut: decodedData.tokenOut,
          minAmountOut: decodedData.minAmountOut,
          $dstChain: decodedData.dstChain,
        }),
      ]
    }
  }
}

export function logToProtocolData(
  log: Log,
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
): DecodedData | undefined {
  const parsed1 = parseForwardedEth(log, null) ?? parseForwardedERC20(log, null)
  if (parsed1) {
    return decodeProtocolData(parsed1.protocolData, wormholeNetworks, [])
  }
  // For SwapAndForwarded events, use tokenIn/amountIn from the event (user's actual tokens)
  const swapERC20 = parseSwapAndForwardedERC20(log, null)
  if (swapERC20) {
    const decoded = decodeProtocolData(
      swapERC20.mayanData,
      wormholeNetworks,
      [],
    )
    if (decoded) {
      decoded.tokenIn = Address32.from(swapERC20.tokenIn)
      decoded.amountIn = swapERC20.amountIn
    }
    return decoded
  }
  const swapEth = parseSwapAndForwardedEth(log, null)
  if (swapEth) {
    const decoded = decodeProtocolData(swapEth.mayanData, wormholeNetworks, [])
    if (decoded) {
      decoded.tokenIn = Address32.NATIVE
      decoded.amountIn = swapEth.amountIn
    }
    return decoded
  }
}

// Zero tokenOut means native token on destination
function tokenOutOrNative(tokenOut: string): Address32 {
  const addr = Address32.from(tokenOut)
  return addr === Address32.ZERO ? Address32.NATIVE : addr
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

function getChainFromWormholeId(
  wormholeNetworks: { chain: string; wormholeChainId: number }[],
  wormholeId: number,
) {
  return findChain(wormholeNetworks, (x) => x.wormholeChainId, wormholeId)
}

function getChainFromCctpDomain(
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

type DestinationIdSpace = 'wormhole' | 'cctp'

// selectors include destinations encoded with circle ids vs wormhole ids
const DESTINATION_ID_SPACE_BY_SELECTOR: Record<string, DestinationIdSpace> = {
  [SELECTOR_CREATE_ORDER_WITH_TOKEN]: 'wormhole',
  [SELECTOR_CREATE_ORDER_WITH_ETH]: 'wormhole',
  [SELECTOR_CREATE_ORDER_MAYAN_CIRCLE]: 'wormhole',
  [SELECTOR_SWAP]: 'wormhole',
  [SELECTOR_WRAP_AND_SWAP_ETH]: 'wormhole',
  [SELECTOR_BRIDGE_WITH_FEE]: 'cctp',
  [SELECTOR_BRIDGE_WITH_LOCKED_FEE]: 'cctp',
  [SELECTOR_CREATE_ORDER_FAST_MCTP]: 'cctp',
  [SELECTOR_BRIDGE_FAST_MCTP]: 'cctp',
}

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
  // Mayan forwards multiple protocol calls. Destination IDs are in two spaces:
  // - Wormhole chain IDs (destChain/destChainId)
  // - CCTP domains (destDomain)
  // This selector map makes the expected ID space explicit.
  const destinationIdSpace =
    DESTINATION_ID_SPACE_BY_SELECTOR[decoded.methodSignature]

  // decodeFunctionData gives us functionName + args.
  // We branch by functionName, and use selector only for overloaded createOrder.
  // - 0x1c59b7fc (mayanCircle) -> Wormhole chain IDs
  // - 0x2337e236 (fastMCTP) -> CCTP domains
  if (res.functionName === 'createOrderWithToken') {
    // Swift token flow (Wormhole destination id).
    decoded.dstChain = getChainFromWormholeId(
      wormholeNetworks,
      res.args[2].destChainId,
    )
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1]
    decoded.tokenOut = tokenOutOrNative(res.args[2].tokenOut)
    decoded.minAmountOut = res.args[2].minAmountOut
  } else if (res.functionName === 'createOrderWithEth') {
    // Swift native flow (Wormhole destination id).
    decoded.dstChain = getChainFromWormholeId(
      wormholeNetworks,
      res.args[0].destChainId,
    )
    decoded.tokenIn = Address32.NATIVE
    decoded.tokenOut = tokenOutOrNative(res.args[0].tokenOut)
    decoded.minAmountOut = res.args[0].minAmountOut
  } else if (res.functionName === 'createOrder') {
    if (decoded.methodSignature === SELECTOR_CREATE_ORDER_MAYAN_CIRCLE) {
      if (destinationIdSpace !== 'wormhole') return decoded
      // Circle createOrder overload with Wormhole-style destination id.
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
    } else if (decoded.methodSignature === SELECTOR_CREATE_ORDER_FAST_MCTP) {
      if (destinationIdSpace !== 'cctp') return decoded
      // FastMCTP createOrder overload with CCTP destination domain.
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
    }
  } else if (res.functionName === 'bridgeWithFee') {
    // CCTP bridge paths use Circle domains, not Wormhole ids.
    decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[5])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1]
  } else if (res.functionName === 'bridgeWithLockedFee') {
    // CCTP bridge paths use Circle domains, not Wormhole ids.
    decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[4])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1]
  } else if (res.functionName === 'bridge') {
    // CCTP bridge paths use Circle domains, not Wormhole ids.
    decoded.dstChain = getChainFromCctpDomain(cctpNetworks, res.args[6])
    decoded.tokenIn = Address32.from(res.args[0])
    decoded.amountIn = res.args[1]
  } else if (res.functionName === 'swap') {
    // MayanSwap uses Wormhole destination ids.
    decoded.dstChain = getChainFromWormholeId(wormholeNetworks, res.args[3])
    decoded.tokenIn = Address32.from(res.args[5])
    decoded.amountIn = res.args[6]
    decoded.tokenOut = tokenOutOrNative(res.args[2])
    decoded.minAmountOut = res.args[4].amountOutMin
  } else if (res.functionName === 'wrapAndSwapETH') {
    // MayanSwap native variant uses Wormhole destination ids.
    decoded.dstChain = getChainFromWormholeId(wormholeNetworks, res.args[3])
    decoded.tokenIn = Address32.NATIVE
    decoded.tokenOut = tokenOutOrNative(res.args[2])
    decoded.minAmountOut = res.args[4].amountOutMin
  }
  return decoded
}
