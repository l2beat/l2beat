import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, uint } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, protocolReads } from './types'

const abi = new utils.Interface([
  'function exchangeRate() view returns (uint256)',
])

export function getCbethReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'cbeth' }>,
) {
  return protocolReads({
    calls: {
      rate: encodeCall(abi, contracts.cbETH, 'exchangeRate'),
    },
    // There is no onchain redemption, so the market is the only exit.
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
    }),
    token: contracts.cbETH,
    saleValue: saleAtRate,
  })
}
