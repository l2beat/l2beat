import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

const rswETH = ChainSpecificAddress(
  'eth:0xFAe103DC9cf190eD75350761e95403b7b8aFa6c0',
)

export const rsweth = liquidStakingListing({
  id: 'rsweth',
  name: 'Swell rswETH',
  shortName: 'rswETH',
  addedAt: UnixTime(1795564800), // 2026-11-25
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: rswETH,
      symbol: 'rswETH',
      rate: {
        address: rswETH,
        method: 'function getRate() view returns (uint256)',
      },
    },
    // Each pool was the best market for a while; the Uniswap and PancakeSwap
    // ones have since emptied.
    marketQuotes: [
      {
        type: 'curve',
        pool: ChainSpecificAddress(
          'eth:0xeE04382c4cA6c450213923fE0f0daB19b0ff3939',
        ),
        i: 1,
        j: 0,
      },
      { type: 'pancakeV3', fee: 500 },
      { type: 'uniswapV3', fee: 500 },
    ],
    // An hour after rswETH's deployment, 2024-01-26.
    sinceTimestamp: UnixTime(1706244695),
  },
})
