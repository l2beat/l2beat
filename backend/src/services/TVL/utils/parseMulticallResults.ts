import { BigNumber } from 'ethers'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from '../../../constants'
import { divOrZero, tokenIsBefore } from '../../../utils'
import {
  EthBalanceCall,
  MulticallResponse,
  TokenBalanceCall,
  UniV2ReservesCall,
} from '../../multicall'

export function parseMulticallResults(
  results: Record<string, MulticallResponse>
) {
  const tokenBalances = parseTokenBalances(results)
  const ethBalances = parseEthBalances(results)
  const ethPrice = parseEthPrice(results)
  const tokenPrices = parseTokenPrices(results, ethPrice)
  return {
    balances: {
      token: tokenBalances,
      eth: ethBalances,
    },
    prices: {
      token: tokenPrices,
      eth: ethPrice,
    },
  }
}

function parseTokenBalances(results: Record<string, MulticallResponse>) {
  const tokenBalances: Record<string, Record<string, BigNumber>> = {}
  for (const [key, result] of Object.entries(results)) {
    if (key.startsWith('token-')) {
      const [, token, holder] = key.split('-')
      const balance = TokenBalanceCall.decodeOrZero(result)
      const balances = tokenBalances[token] ?? {}
      tokenBalances[token] = balances
      balances[holder] = balance
    }
  }
  return tokenBalances
}

function parseEthBalances(results: Record<string, MulticallResponse>) {
  const ethBalances: Record<string, BigNumber> = {}
  for (const [key, result] of Object.entries(results)) {
    if (key.startsWith('eth-')) {
      const [, holder] = key.split('-')
      const balance = EthBalanceCall.decodeOrZero(result)
      ethBalances[holder] = balance
    }
  }
  return ethBalances
}

function parseEthPrice(results: Record<string, MulticallResponse>) {
  const v1Dai = TokenBalanceCall.decodeOrZero(results[`uniV1-token-${DAI}`])
  const v1Eth = EthBalanceCall.decodeOrZero(results[`uniV1-eth-${DAI}`])
  const reservesResponse = results[`uniV2Weth-${DAI}`]
  const [v2Dai, v2Weth] = UniV2ReservesCall.decodeOrZero(reservesResponse)
  const [dai, eth] = v1Eth.gt(v2Weth) ? [v1Dai, v1Eth] : [v2Dai, v2Weth]
  return divOrZero(dai.mul(TEN_TO_18), eth)
}

interface ExchangePrice {
  liquidity: BigNumber
  price: BigNumber
}

type PartialResults = Record<string, MulticallResponse | undefined>

const KNOWN_TOKENS = [WETH, DAI, USDC, USDT]
function parseTokenPrices(results: PartialResults, ethPrice: BigNumber) {
  const tokens = Object.keys(results)
    .filter((key) => key.startsWith('token-'))
    .map((key) => key.split('-')[1])
    .filter((x, i, a) => a.indexOf(x) === i && !KNOWN_TOKENS.includes(x))

  const tokenPrices: Record<string, BigNumber> = {}
  tokenPrices[WETH] = ethPrice
  tokenPrices[DAI] = TEN_TO_18
  const stableCoinPrice = BigNumber.from(10).pow(18 * 2 - 6)
  tokenPrices[USDC] = stableCoinPrice
  tokenPrices[USDT] = stableCoinPrice

  const pairs: [string, string, BigNumber][] = [
    ['Weth', WETH, ethPrice],
    ['Usdc', USDC, stableCoinPrice],
    ['Usdt', USDT, stableCoinPrice],
  ]

  for (const token of tokens) {
    const prices: ExchangePrice[] = []
    prices.push(getV1Price(results, ethPrice, token))
    for (const [name, address, price] of pairs) {
      prices.push(getV2Price(results, name, address, price, token))
    }
    const bestPrice = prices.reduce((a, b) =>
      a.liquidity.gt(b.liquidity) ? a : b
    )
    tokenPrices[token] = bestPrice.price
  }
  return tokenPrices
}

function getV1Price(
  results: PartialResults,
  ethPrice: BigNumber,
  token: string
): ExchangePrice {
  const tokenBalanceResponse = results[`uniV1-token-${token}`]
  const tokenBalance = TokenBalanceCall.decodeOrZero(tokenBalanceResponse)
  const ethBalanceResponse = results[`uniV1-token-${token}`]
  const ethBalance = EthBalanceCall.decodeOrZero(ethBalanceResponse)
  const price = divOrZero(ethBalance.mul(ethPrice), tokenBalance)
  return { liquidity: tokenBalance, price }
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
    reserves?.reverse()
  }
  const [tokenBalance, otherBalance] = reserves
  const price = divOrZero(tokenBalance.mul(otherPrice), otherBalance)
  return { liquidity: tokenBalance, price }
}
