import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, uint } from '../calls'
import { saleAtRate } from '../marketQuotes'
import { EMPTY_EXIT, protocolReads } from './types'

const abi = new utils.Interface([
  'function exchangeRate() view returns (uint256)',
  'function lockTime() view returns (uint256)',
  'function nextIndex() view returns (uint256)',
  'function startAllocatedEthIndex() view returns (uint256)',
])

export function getWbethReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'wbeth' }>,
) {
  return protocolReads({
    calls: {
      rate: encodeCall(abi, contracts.wBETH, 'exchangeRate'),
      lockTime: encodeCall(abi, contracts.unwrapToken, 'lockTime'),
      nextIndex: encodeCall(abi, contracts.unwrapToken, 'nextIndex'),
      startAllocated: encodeCall(
        abi,
        contracts.unwrapToken,
        'startAllocatedEthIndex',
      ),
    },
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
      lockTime: Number(uint(r.lockTime)),
      // A request can be claimed once it's allocated ETH and its lock has
      // passed. Allocation goes in request order, like a queue.
      lastRequestId: Number(uint(r.nextIndex)) - 1,
      lastFinalizedRequestId: Number(uint(r.startAllocated)) - 1,
    }),
    token: contracts.wBETH,
    saleValue: saleAtRate,
  })
}
