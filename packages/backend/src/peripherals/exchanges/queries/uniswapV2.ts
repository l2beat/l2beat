import { utils } from 'ethers'
import memoizee from 'memoizee'

import { Bytes, EthereumAddress, KeccakHash } from '../../../model'
import { Exchange } from '../../../model/Exchange'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../ethereum/MulticallClient'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from './constants'

const UNISWAP_V2_FACTORY = EthereumAddress(
  '0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f'
)

const UNISWAP_V2_CODE_HASH = new KeccakHash(
  '0x96e8ac4277198ff8b6f785478aa9a39f403cb768dd02cbee326c3e7da348845f'
)

const coder = new utils.Interface([
  'function getReserves() view returns (uint112 reserve0, uint112 reserve1, uint32)',
])

export const encodeUniswapV2Requests = memoizee(
  (token: EthereumAddress, exchange: Exchange): MulticallRequest[] => {
    const otherToken = getOtherToken(exchange)
    const pair = getUniswapV2PairAddress(token, otherToken)
    return [{ address: pair, data: encodeGetReserves() }]
  },
  { primitive: true }
)

export function decodeUniswapV2Results(
  token: EthereumAddress,
  exchange: Exchange,
  results: MulticallResponse[]
) {
  if (results.length !== 1 || !results[0].success) {
    return { liquidity: 0n, price: 0n }
  }
  const otherToken = getOtherToken(exchange)
  const [reserve0, reserve1] = decodeGetReserves(results[0].data)
  const [tokenReserve, otherReserve] = EthereumAddress.isBefore(
    token,
    otherToken
  )
    ? [reserve0, reserve1]
    : [reserve1, reserve0]
  const price =
    tokenReserve !== 0n ? (TEN_TO_18 * otherReserve) / tokenReserve : 0n
  return { liquidity: tokenReserve, price: price }
}

const tokens: Record<string, EthereumAddress> = {
  'wrapped-ether': WETH,
  'dai-stablecoin': DAI,
  'usd-coin': USDC,
  'tether-usd': USDT,
}

function getOtherToken(exchange: Exchange) {
  const token = tokens[exchange.quoteAssetId]
  if (!token || exchange.family !== 'uniswap-v2') {
    throw new Error(`Invalid exchange ${exchange.name}`)
  }
  return token
}

export function getUniswapV2PairAddress(
  tokenA: EthereumAddress,
  tokenB: EthereumAddress
) {
  const [token0, token1] = EthereumAddress.inOrder(tokenA, tokenB)
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
  return EthereumAddress(address)
}

export function encodeGetReserves() {
  const encoded = coder.encodeFunctionData('getReserves', [])
  return Bytes.fromHex(encoded)
}

export function decodeGetReserves(data: Bytes) {
  const decoded = coder.decodeFunctionResult('getReserves', data.toString())
  return [BigInt(decoded[0].toString()), BigInt(decoded[1].toString())]
}
