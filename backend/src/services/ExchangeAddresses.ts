import { constants, utils } from 'ethers'
import { AbiCoder } from 'ethers/lib/utils'
import { TokenInfo } from '../../../config/build/src'
import {
  UNISWAP_V1_FACTORY,
  UNISWAP_V1_SNAPSHOT_BLOCK,
  UNISWAP_V2_CODE_HASH,
  UNISWAP_V2_FACTORY,
  UNISWAP_V3_CODE_HASH,
  UNISWAP_V3_FACTORY,
  USDC,
  USDT,
  WETH,
} from '../constants'
import { MulticallApi, MulticallRequest } from './api/MulticallApi'

export interface ExchangeInfo {
  isBeforeWeth: boolean
  isBeforeUsdc: boolean
  isBeforeUsdt: boolean
  uniV1: string | undefined
  uniV2Weth: string
  uniV2Usdc: string
  uniV2Usdt: string
  uniV3Weth500: string
  uniV3Usdc500: string
  uniV3Usdt500: string
  uniV3Weth3000: string
  uniV3Usdc3000: string
  uniV3Usdt3000: string
  uniV3Weth10000: string
  uniV3Usdc10000: string
  uniV3Usdt10000: string
}

export class ExchangeAddresses {
  constructor(private multicallApi: MulticallApi) {}

  async getExchanges(tokens: TokenInfo[]) {
    const v1Addresses = await this.getV1Addresses(tokens)
    const exchanges: Record<string, ExchangeInfo> = {}
    for (const token of tokens) {
      const address = token.address
      if (!address) {
        continue
      }
      exchanges[address] = {
        isBeforeWeth: isBefore(address, WETH),
        isBeforeUsdc: isBefore(address, USDC),
        isBeforeUsdt: isBefore(address, USDT),
        uniV1: v1Addresses[address],
        uniV2Weth: getUniswapV2PairAddress(address, WETH),
        uniV2Usdc: getUniswapV2PairAddress(address, USDC),
        uniV2Usdt: getUniswapV2PairAddress(address, USDT),
        uniV3Weth500: getUniswapV3PoolAddress(address, WETH, 500),
        uniV3Usdc500: getUniswapV3PoolAddress(address, USDC, 500),
        uniV3Usdt500: getUniswapV3PoolAddress(address, USDT, 500),
        uniV3Weth3000: getUniswapV3PoolAddress(address, WETH, 3000),
        uniV3Usdc3000: getUniswapV3PoolAddress(address, USDC, 3000),
        uniV3Usdt3000: getUniswapV3PoolAddress(address, USDT, 3000),
        uniV3Weth10000: getUniswapV3PoolAddress(address, WETH, 10000),
        uniV3Usdc10000: getUniswapV3PoolAddress(address, USDC, 10000),
        uniV3Usdt10000: getUniswapV3PoolAddress(address, USDT, 10000),
      }
    }
    return exchanges
  }

  async getV1Addresses(tokens: TokenInfo[]) {
    const requests: Record<string, MulticallRequest> = {}
    for (const token of tokens) {
      if (token.address) {
        requests[token.address] = getUniswapV1ExchangeAddress(token.address)
      }
    }
    const responses = await this.multicallApi.multicall(
      requests,
      UNISWAP_V1_SNAPSHOT_BLOCK
    )
    const addresses: Record<string, string> = {}
    for (const [token, result] of Object.entries(responses)) {
      if (result.success) {
        const exchange = parseV1ExchangeAddress(result.data)
        if (exchange !== constants.AddressZero) {
          addresses[token] = exchange
        }
      }
    }
    return addresses
  }
}

const coder = new utils.Interface([
  'function getExchange(address token) view returns (address)',
])

export function parseV1ExchangeAddress(data: string) {
  return coder.decodeFunctionResult('getExchange', data)[0]
}

export function getUniswapV1ExchangeAddress(token: string): MulticallRequest {
  return {
    address: UNISWAP_V1_FACTORY,
    data: coder.encodeFunctionData('getExchange', [token]),
  }
}

export function getUniswapV2PairAddress(
  tokenA: string,
  tokenB: string
): string {
  const [token0, token1] = inOrder(tokenA, tokenB)
  return utils.getCreate2Address(
    UNISWAP_V2_FACTORY,
    utils.solidityKeccak256(
      ['bytes'],
      [utils.solidityPack(['address', 'address'], [token0, token1])]
    ),
    UNISWAP_V2_CODE_HASH
  )
}

export function getUniswapV3PoolAddress(
  tokenA: string,
  tokenB: string,
  fee: 500 | 3000 | 10000
): string {
  const [token0, token1] = inOrder(tokenA, tokenB)
  return utils.getCreate2Address(
    UNISWAP_V3_FACTORY,
    utils.solidityKeccak256(
      ['bytes'],
      [
        new AbiCoder().encode(
          ['address', 'address', 'uint24'],
          [token0, token1, fee]
        ),
      ]
    ),
    UNISWAP_V3_CODE_HASH
  )
}

function isBefore(tokenA: string, tokenB: string) {
  return tokenA.toLowerCase() < tokenB.toLowerCase()
}

function inOrder(tokenA: string, tokenB: string): [string, string] {
  return isBefore(tokenA, tokenB) ? [tokenA, tokenB] : [tokenB, tokenA]
}
