import { Bytes, EthereumAddress, Exchange, KeccakHash } from '@l2beat/common'
import { utils } from 'ethers'
import memoizee from 'memoizee'

import {
  MulticallRequest,
  MulticallResponse,
} from '../../ethereum/MulticallClient'
import { decodeBalanceOf, encodeBalanceOf } from './balanceOf'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from './constants'

const UNISWAP_V3_FACTORY = EthereumAddress(
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
)

const UNISWAP_V3_CODE_HASH = new KeccakHash(
  '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
)

const coder = new utils.Interface([
  'function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)',
])

export const encodeUniswapV3Requests = memoizee(
  (token: EthereumAddress, exchange: Exchange): MulticallRequest[] => {
    const [quoteToken, feeLevel] = getExchangeDetails(exchange)
    const pool = getUniswapV3PoolAddress(token, quoteToken, feeLevel)
    return [
      { address: token, data: encodeBalanceOf(pool) },
      { address: pool, data: encodeSlotZero() },
    ]
  }
)

export function decodeUniswapV3Results(
  token: EthereumAddress,
  exchange: Exchange,
  results: MulticallResponse[]
) {
  if (results.length !== 2 || !results.every((x) => x.success)) {
    return { liquidity: 0n, price: 0n }
  }
  const [quoteToken] = getExchangeDetails(exchange)
  const balance = decodeBalanceOf(results[0].data)
  const priceSqrt64x96 = decodeSlotZero(results[1].data)
  let price = (priceSqrt64x96 ** 2n * TEN_TO_18) >> (96n * 2n)
  if (!EthereumAddress.isBefore(token, quoteToken) && price !== 0n) {
    price = (TEN_TO_18 * TEN_TO_18) / price
  }
  return { liquidity: balance, price }
}

const tokens: Record<string, EthereumAddress> = {
  'wrapped-ether': WETH,
  'dai-stablecoin': DAI,
  'usd-coin': USDC,
  'tether-usd': USDT,
}

function getExchangeDetails(exchange: Exchange) {
  const quoteToken = tokens[exchange.quoteAssetId]
  const feeLevel = exchange.details.fee
  if (
    !quoteToken ||
    typeof feeLevel !== 'number' ||
    exchange.family !== 'uniswap-v3'
  ) {
    throw new Error(`Invalid exchange ${exchange.name}`)
  }
  return [quoteToken, feeLevel] as const
}

export function getUniswapV3PoolAddress(
  tokenA: EthereumAddress,
  tokenB: EthereumAddress,
  feeLevel: number
) {
  const [token0, token1] = EthereumAddress.inOrder(tokenA, tokenB)
  const address = utils.getCreate2Address(
    UNISWAP_V3_FACTORY.toString(),
    utils.solidityKeccak256(
      ['bytes'],
      [
        new utils.AbiCoder().encode(
          ['address', 'address', 'uint24'],
          [token0.toString(), token1.toString(), feeLevel]
        ),
      ]
    ),
    UNISWAP_V3_CODE_HASH.toString()
  )

  return EthereumAddress(address)
}

export function encodeSlotZero() {
  const encoded = coder.encodeFunctionData('slot0', [])
  return Bytes.fromHex(encoded)
}

export function decodeSlotZero(data: Bytes) {
  const decoded = coder.decodeFunctionResult('slot0', data.toString())
  return BigInt(decoded[0].toString())
}
