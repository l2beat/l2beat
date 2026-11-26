import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

const LsETH = ChainSpecificAddress(
  'eth:0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549',
)

export const liquidcollective = liquidStakingListing({
  id: 'liquidcollective',
  name: 'Liquid Collective',
  addedAt: UnixTime(1795564800), // 2026-11-25
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: LsETH,
      symbol: 'LsETH',
      // The token is River, which converts shares to the ETH they stand for.
      rate: {
        address: LsETH,
        method:
          'function underlyingBalanceFromShares(uint256) view returns (uint256)',
      },
    },
    // The 0.05% pool was the only market until the 0.01% pool opened in
    // 2026-03.
    marketQuotes: [
      { type: 'uniswapV3', fee: 100 },
      { type: 'uniswapV3', fee: 500 },
    ],
  },
})
