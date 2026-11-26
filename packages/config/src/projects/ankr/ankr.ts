import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

const ankrETH = ChainSpecificAddress(
  'eth:0xE95A203B1a91a908F9B9CE46459d101078c2c3cb',
)

export const ankr = liquidStakingListing({
  id: 'ankr',
  name: 'Ankr',
  addedAt: UnixTime(1795564800), // 2026-11-25
  // ankrETH only: Ankr's other tokens stake other assets.
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: ankrETH,
      symbol: 'ankrETH',
      // The ETH one ankrETH is worth: the inverse of `ratio()`.
      rate: {
        address: ankrETH,
        method: 'function sharesToBonds(uint256) view returns (uint256)',
      },
    },
    marketQuotes: [
      {
        type: 'curve',
        pool: ChainSpecificAddress(
          'eth:0xA96A65c051bF88B4095Ee1f2451C2A9d43F53Ae2',
        ),
        i: 1,
        j: 0,
      },
    ],
  },
})
