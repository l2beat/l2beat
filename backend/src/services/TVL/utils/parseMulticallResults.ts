import { BigNumber } from 'ethers'
import { DAI, TEN_TO_18, USDC, USDT, WETH } from '../../../constants'
import { MulticallResponse } from '../../api/MulticallApi'
import { coder } from './coder'

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
      const balance = coder.decodeFunctionResult('balanceOf', result.data)[0]
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
      const balance = coder.decodeFunctionResult(
        'getEthBalance',
        result.data
      )[0]
      ethBalances[holder] = balance
    }
  }
  return ethBalances
}

function parseEthPrice(results: Record<string, MulticallResponse>) {
  const v1Dai: BigNumber = coder.decodeFunctionResult(
    'balanceOf',
    results[`uniV1-token-${DAI}`].data
  )[0]
  const v1Eth: BigNumber = coder.decodeFunctionResult(
    'getEthBalance',
    results[`uniV1-eth-${DAI}`].data
  )[0]
  const reserveResult = results[`uniV2Weth-${DAI}`]
  const reserves = reserveResult.success
    ? coder.decodeFunctionResult('getReserves', reserveResult.data)
    : [BigNumber.from(0), BigNumber.from(0)]
  const v2Dai: BigNumber = reserves[0]
  const v2Weth: BigNumber = reserves[1]

  const [dai, eth] = v1Eth.gt(v2Weth) ? [v1Dai, v1Eth] : [v2Dai, v2Weth]
  return eth.eq(0) ? BigNumber.from(0) : dai.mul(TEN_TO_18).div(eth)
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
  const tokenBalance = decodeBalanceOf(results[`uniV1-token-${token}`])
  const ethBalance = decodeEthBalanceOf(results[`uniV1-token-${token}`])
  if (tokenBalance && ethBalance) {
    const price = tokenBalance.eq(0)
      ? BigNumber.from(0)
      : ethBalance.mul(ethPrice).div(tokenBalance)
    return { liquidity: tokenBalance, price }
  }
  return { liquidity: BigNumber.from(0), price: BigNumber.from(0) }
}

function getV2Price(
  results: PartialResults,
  otherName: string,
  otherAddress: string,
  otherPrice: BigNumber,
  token: string
) {
  const reserves = decodeReservesOf(results[`uniV2${otherName}-${token}`])
  if (!reserves) {
    return { liquidity: BigNumber.from(0), price: BigNumber.from(0) }
  }
  // TODO: use common functions
  if (otherAddress.toLowerCase() > token.toLowerCase()) {
    reserves?.reverse()
  }
  const [tokenBalance, otherBalance] = reserves
  const price = tokenBalance.eq(0)
    ? BigNumber.from(0)
    : tokenBalance.mul(otherPrice).div(otherBalance)
  return { liquidity: tokenBalance, price }
}

function decodeBalanceOf(result: MulticallResponse | undefined) {
  if (!result || !result.success) {
    return
  }
  return coder.decodeFunctionResult('balanceOf', result.data)[0] as BigNumber
}

function decodeEthBalanceOf(result: MulticallResponse | undefined) {
  if (!result || !result.success) {
    return
  }
  return coder.decodeFunctionResult(
    'getEthBalance',
    result.data
  )[0] as BigNumber
}

function decodeReservesOf(result: MulticallResponse | undefined) {
  if (!result || !result.success) {
    return
  }
  const decoded = coder.decodeFunctionResult('getReserves', result.data)
  return [decoded[0], decoded[1]] as [BigNumber, BigNumber]
}
