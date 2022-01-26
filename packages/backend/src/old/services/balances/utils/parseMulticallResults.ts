import { BigNumber } from 'ethers'

import {
  EthBalanceCall,
  MulticallResponse,
  TokenBalanceCall,
} from '../../multicall'

export function parseMulticallResults(
  results: Record<string, MulticallResponse>
) {
  return {
    token: parseTokenBalances(results),
    eth: parseEthBalances(results),
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
