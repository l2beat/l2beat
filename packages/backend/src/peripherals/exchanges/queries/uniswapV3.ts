import { AbiCoder } from '@ethersproject/abi'
import { utils } from 'ethers'
import memoizee from 'memoizee'

import { Bytes, EthereumAddress, KeccakHash } from '../../../model'
import {
  MulticallRequest,
  MulticallResponse,
} from '../../ethereum/MulticallClient'
import { decodeBalanceOf, encodeBalanceOf } from './balanceOf'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from './constants'

const UNISWAP_V3_FACTORY = new EthereumAddress(
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
)

const UNISWAP_V3_CODE_HASH = new KeccakHash(
  '0xe34f199b19b2b4f47f68442619d555527d244f78a3297ea89325f843f87b8b54'
)

const coder = new utils.Interface([
  'function slot0() view returns (uint160 sqrtPriceX96, int24, uint16, uint16, uint16, uint8, bool)',
])

export const encodeUniswapV3Requests = memoizee(
  (token: EthereumAddress, exchange: string): MulticallRequest[] => {
    const [otherToken, feeLevel] = getExchangeDetails(exchange)
    const pool = getUniswapV3PoolAddress(token, otherToken, feeLevel)
    return [
      { address: token, data: encodeBalanceOf(pool) },
      { address: pool, data: encodeSlotZero() },
    ]
  },
  { primitive: true }
)

export function decodeUniswapV3Results(
  token: EthereumAddress,
  exchange: string,
  results: MulticallResponse[]
) {
  if (results.length !== 2 || !results.every((x) => x.success)) {
    return { liquidity: 0n, price: 0n }
  }
  const [otherToken] = getExchangeDetails(exchange)
  const balance = decodeBalanceOf(results[0].data)
  const priceSqrt64x96 = decodeSlotZero(results[1].data)
  let price = (priceSqrt64x96 ** 2n * TEN_TO_18) >> (96n * 2n)
  if (!token.isBefore(otherToken) && price !== 0n) {
    price = (TEN_TO_18 * TEN_TO_18) / price
  }
  return { liquidity: balance, price }
}

const tokens: Record<string, EthereumAddress> = {
  weth: WETH,
  dai: DAI,
  usdc: USDC,
  usdt: USDT,
}

function getExchangeDetails(exchange: string) {
  const [symbol, feeLevel] = exchange.substring('uniswap-v3-'.length).split('-')
  const token = tokens[symbol]
  if (!token || !/^\d+$/.test(feeLevel)) {
    throw new Error(`Invalid exchange ${exchange}`)
  }
  return [token, parseInt(feeLevel)] as const
}

export function getUniswapV3PoolAddress(
  tokenA: EthereumAddress,
  tokenB: EthereumAddress,
  feeLevel: number
) {
  const [token0, token1] = tokenA.isBefore(tokenB)
    ? [tokenA, tokenB]
    : [tokenB, tokenA]
  const address = utils.getCreate2Address(
    UNISWAP_V3_FACTORY.toString(),
    utils.solidityKeccak256(
      ['bytes'],
      [
        new AbiCoder().encode(
          ['address', 'address', 'uint24'],
          [token0.toString(), token1.toString(), feeLevel]
        ),
      ]
    ),
    UNISWAP_V3_CODE_HASH.toString()
  )

  return new EthereumAddress(address)
}

export function encodeSlotZero() {
  const encoded = coder.encodeFunctionData('slot0', [])
  return Bytes.fromHex(encoded)
}

export function decodeSlotZero(data: Bytes) {
  const decoded = coder.decodeFunctionResult('slot0', data.toString())
  return BigInt(decoded[0].toString())
}
