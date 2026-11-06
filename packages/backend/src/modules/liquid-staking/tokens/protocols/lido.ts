import type { ProjectLiquidStakingContracts } from '@l2beat/config'
import { utils } from 'ethers'
import { encodeCall, UNIT, uint } from '../calls'
import { MARKET_SALE } from '../marketQuotes'
import { EMPTY_EXIT, protocolReads } from './types'

const abi = new utils.Interface([
  'function getPooledEthByShares(uint256 sharesAmount) view returns (uint256)',
  'function getLastRequestId() view returns (uint256)',
  'function getLastFinalizedRequestId() view returns (uint256)',
])

export function getLidoReads(
  contracts: Extract<ProjectLiquidStakingContracts, { type: 'lido' }>,
) {
  return protocolReads({
    calls: {
      // ETH per share, which is ETH per wstETH: stETH itself stays at one ETH
      // and rebases.
      rate: encodeCall(abi, contracts.stETH, 'getPooledEthByShares', [UNIT]),
      lastRequest: encodeCall(
        abi,
        contracts.withdrawalQueue,
        'getLastRequestId',
      ),
      lastFinalized: encodeCall(
        abi,
        contracts.withdrawalQueue,
        'getLastFinalizedRequestId',
      ),
    },
    toState: (r) => ({
      ...EMPTY_EXIT,
      exchangeRate: uint(r.rate),
      lastRequestId: Number(uint(r.lastRequest)),
      lastFinalizedRequestId: Number(uint(r.lastFinalized)),
    }),
    token: contracts.stETH,
    // The quotes sell stETH, worth one ETH each.
    saleValue: () => MARKET_SALE,
  })
}
