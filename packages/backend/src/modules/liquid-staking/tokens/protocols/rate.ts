import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, UNIT, uint } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, protocolReads } from './types'

export function getRateReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'rate' }>,
) {
  const abi = new utils.Interface([contracts.rate.method])
  const method = Object.values(abi.functions)[0]
  if (!method) {
    throw new Error('Liquid staking rate method is not a function', {
      cause: { method: contracts.rate.method },
    })
  }
  return protocolReads({
    calls: {
      rate: encodeCall(
        abi,
        contracts.rate.address,
        method.name,
        // One that takes an amount is asked for one token.
        method.inputs.length === 1 ? [UNIT] : [],
      ),
    },
    // No exit is read, so the market is the only one counted.
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
    }),
    token: contracts.token,
    saleValue: saleAtRate,
  })
}
