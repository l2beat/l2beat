import { BigNumber, constants } from 'ethers'

import { CUSDT, DAI, TEN_TO_18, USDC, USDT, WETH } from '../../../constants'
import { divOrZero, tokenIsBefore } from '../../../utils'
import {
  EthBalanceCall,
  MulticallResponse,
  TokenBalanceCall,
  UniV2ReservesCall,
  UniV3PriceCall,
} from '../../multicall'
import { HACK_adjustLiquidity } from './HACK_adjustLiquidity'

const STABLECOIN_PRICE = BigNumber.from(10).pow(18 * 2 - 6)
const CUSDT_PRICE = BigNumber.from(10)
  .pow(18 * 2 - 8)
  .mul(215)
  .div(10000) // $0.0215
const KNOWN_TOKENS = [WETH, DAI, USDC, USDT, CUSDT]

interface ExchangePrice {
  liquidity: BigNumber
  getPrice: () => BigNumber
}

interface Pair {
  name: string
  other: string
  otherPrice: BigNumber
}

type PartialResults = Record<string, MulticallResponse | undefined>

export function parseTokenPrices(results: PartialResults, ethPrice: BigNumber) {
  const tokens = getUniqueNonDefaultTokens(results)
  const tokenPrices = defaultTokenPrices(ethPrice)
  for (const token of tokens) {
    const prices = getPrices(results, ethPrice, token)
    tokenPrices[token] = getBestPrice(prices)
  }
  return tokenPrices
}

function getUniqueNonDefaultTokens(results: PartialResults) {
  return Object.keys(results)
    .filter((key) => key.startsWith('token-'))
    .map((key) => key.split('-')[1])
    .filter((x, i, a) => a.indexOf(x) === i && !KNOWN_TOKENS.includes(x))
}

function defaultTokenPrices(ethPrice: BigNumber) {
  const tokenPrices: Record<string, BigNumber> = {}
  tokenPrices[WETH] = ethPrice
  tokenPrices[DAI] = TEN_TO_18
  tokenPrices[USDC] = STABLECOIN_PRICE
  tokenPrices[USDT] = STABLECOIN_PRICE
  // HACK: fix the price of illiquid cUSDT
  tokenPrices[CUSDT] = CUSDT_PRICE
  return tokenPrices
}

function getPrices(
  results: PartialResults,
  ethPrice: BigNumber,
  token: string
) {
  const pairs = getSupportedPairs(ethPrice)
  const prices: ExchangePrice[] = []
  prices.push(getV1Price(results, ethPrice, token))
  for (const { name, other, otherPrice } of pairs) {
    prices.push(getV2Price(results, name, other, otherPrice, token))
    for (const fee of [500, 3000, 10000]) {
      prices.push(getV3Price(results, name, fee, other, otherPrice, token))
    }
  }
  return prices
}

function getSupportedPairs(ethPrice: BigNumber): Pair[] {
  return [
    { name: 'Weth', other: WETH, otherPrice: ethPrice },
    { name: 'Usdc', other: USDC, otherPrice: STABLECOIN_PRICE },
    { name: 'Usdt', other: USDT, otherPrice: STABLECOIN_PRICE },
  ]
}

function getV1Price(
  results: PartialResults,
  ethPrice: BigNumber,
  token: string
): ExchangePrice {
  const tokenBalanceResponse = results[`uniV1-token-${token}`]
  const tokenBalance = TokenBalanceCall.decodeOrZero(tokenBalanceResponse)
  function getPrice() {
    const ethBalanceResponse = results[`uniV1-eth-${token}`]
    const ethBalance = EthBalanceCall.decodeOrZero(ethBalanceResponse)
    return divOrZero(ethBalance.mul(ethPrice), tokenBalance)
  }
  const liquidity = HACK_adjustLiquidity('v1', token, tokenBalance)
  return { liquidity, getPrice }
}

function getV2Price(
  results: PartialResults,
  otherName: string,
  otherAddress: string,
  otherPrice: BigNumber,
  token: string
) {
  const reservesResponse = results[`uniV2${otherName}-${token}`]
  const reserves = UniV2ReservesCall.decodeOrZero(reservesResponse)
  if (!tokenIsBefore(token, otherAddress)) {
    reserves.reverse()
  }
  const [tokenBalance, otherBalance] = reserves
  function getPrice() {
    return divOrZero(otherBalance.mul(otherPrice), tokenBalance)
  }
  const liquidity = HACK_adjustLiquidity('v2', token, tokenBalance)
  return { liquidity, getPrice }
}

function getV3Price(
  results: PartialResults,
  otherName: string,
  fee: number,
  otherAddress: string,
  otherPrice: BigNumber,
  token: string
) {
  const balanceResponse = results[`uniV3${otherName}${fee}-token-${token}`]
  const balance = TokenBalanceCall.decodeOrZero(balanceResponse)
  function getPrice() {
    const priceResponse = results[`uniV3${otherName}${fee}-price-${token}`]
    const priceSqrt64x96 = UniV3PriceCall.decodeOrZero(priceResponse)
    let price18 = priceSqrt64x96
      .mul(priceSqrt64x96)
      .mul(TEN_TO_18)
      .shr(96 * 2)
    if (!tokenIsBefore(token, otherAddress)) {
      price18 = divOrZero(TEN_TO_18.mul(TEN_TO_18), price18)
    }
    return price18.mul(otherPrice).div(TEN_TO_18)
  }
  const liquidity = HACK_adjustLiquidity('v3', token, balance)
  return { liquidity, getPrice }
}

function getBestPrice(prices: ExchangePrice[]) {
  const { liquidity, getPrice } = prices.reduce((a, b) =>
    a.liquidity.gt(b.liquidity) ? a : b
  )
  return liquidity.eq(0) ? constants.Zero : getPrice()
}
