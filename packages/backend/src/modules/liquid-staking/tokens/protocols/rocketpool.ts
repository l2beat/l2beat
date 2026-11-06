import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, uint } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, protocolReads } from './types'

const abi = new utils.Interface([
  'function getExchangeRate() view returns (uint256)',
  'function getTotalCollateral() view returns (uint256)',
])

export function getRocketPoolReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'rocketpool' }>,
) {
  return protocolReads({
    calls: {
      rate: encodeCall(abi, contracts.rETH, 'getExchangeRate'),
      collateral: encodeCall(abi, contracts.rETH, 'getTotalCollateral'),
    },
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
      instantExitEth: uint(r.collateral),
      instantExitFeeBps: 0,
    }),
    token: contracts.rETH,
    saleValue: saleAtRate,
  })
}
