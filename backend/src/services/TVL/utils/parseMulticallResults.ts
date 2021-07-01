import { BigNumber } from 'ethers'
import { DAI, TEN_TO_18 } from '../../../constants'
import { MulticallResponse } from '../../api/MulticallApi'
import { coder } from './coder'

export function parseMulticallResults(
  results: Record<string, MulticallResponse>
) {
  const tokenBalances = parseTokenBalances(results)
  const ethBalances = parseEthBalances(results)
  const ethPrice = parseEthPrice(results)

  const tokenPrices: Record<string, BigNumber> = {}
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
  return dai.mul(TEN_TO_18).div(eth)
}
