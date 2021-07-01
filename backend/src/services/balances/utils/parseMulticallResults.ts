import { BigNumber } from 'ethers'
import { DAI, TEN_TO_18 } from '../../../constants'
import { divOrZero } from '../../../utils'
import {
  EthBalanceCall,
  MulticallResponse,
  TokenBalanceCall,
  UniV2ReservesCall,
} from '../../multicall'
import { parseTokenPrices } from './parseTokenPrices'

export function parseMulticallResults(
  results: Record<string, MulticallResponse>
) {
  const ethPrice = parseEthPrice(results)
  return {
    balances: {
      token: parseTokenBalances(results),
      eth: parseEthBalances(results),
    },
    prices: {
      token: parseTokenPrices(results, ethPrice),
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
