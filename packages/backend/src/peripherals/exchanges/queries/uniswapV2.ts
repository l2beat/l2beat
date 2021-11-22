import { utils } from 'ethers'
import memoizee from 'memoizee'

import { Bytes, EthereumAddress, KeccakHash } from '../../../model'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../ethereum/MulticallClient'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from './constants'

const UNISWAP_V2_FACTORY = new EthereumAddress(
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
)

const UNISWAP_V2_CODE_HASH = new KeccakHash(
  '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
)

const coder = new utils.Interface([
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)',
])

export const encodeUniswapV2Requests = memoizee(
  (token: EthereumAddress, exchange: string): MulticallRequest[] => {
    const otherToken = getOtherToken(exchange)
    const pair = getUniswapV2PairAddress(token, otherToken)
    return [{ address: pair, data: encodeGetReserves() }]
  },
  { primitive: true }
)

export function decodeUniswapV2Results(
  token: EthereumAddress,
  exchange: string,
  results: MulticallResponse[]
) {
  if (results.length !== 1 || !results[0].success) {
    return { liquidity: 0n, price: 0n }
  }
  const otherToken = getOtherToken(exchange)
  const [reserve0, reserve1] = decodeGetReserves(results[0].data)
  const [tokenReserve, otherReserve] = token.isBefore(otherToken)
    ? [reserve0, reserve1]
    : [reserve1, reserve0]
  const price =
    tokenReserve !== 0n ? (TEN_TO_18 * otherReserve) / tokenReserve : 0n
  return { liquidity: tokenReserve, price: price }
}

const tokens: Record<string, EthereumAddress> = {
  weth: WETH,
  dai: DAI,
  usdc: USDC,
  usdt: USDT,
}

function getOtherToken(exchange: string) {
  const symbol = exchange.substring('uniswap-v2-'.length)
  const token = tokens[symbol]
  if (!token) {
    throw new Error(`Invalid exchange ${exchange}`)
  }
  return token
}

export function getUniswapV2PairAddress(
  tokenA: EthereumAddress,
  tokenB: EthereumAddress
) {
  const [token0, token1] = tokenA.isBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  const address = utils.getCreate2Address(
    UNISWAP_V2_FACTORY.toString(),
    utils.solidityKeccak256(
      ['bytes'],
      [
        utils.solidityPack(
          ['address', 'address'],
          [token0.toString(), token1.toString()]
        ),
      ]
    ),
    UNISWAP_V2_CODE_HASH.toString()
  )
  return new EthereumAddress(address)
}

export function encodeGetReserves() {
  const encoded = coder.encodeFunctionData('getReserves', [])
  return Bytes.fromHex(encoded)
}

export function decodeGetReserves(data: Bytes) {
  const decoded = coder.decodeFunctionResult('getReserves', data.toString())
  return [BigInt(decoded[0].toString()), BigInt(decoded[1].toString())]
}
