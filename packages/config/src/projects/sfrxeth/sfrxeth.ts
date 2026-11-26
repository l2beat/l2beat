import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

const sfrxETH = ChainSpecificAddress(
  'eth:0xac3E018457B222d93114458476f3E3416Abbe38F',
)

// Frax Ether has two tokens. frxETH has no rate: it is pegged to ETH and earns
// nothing. sfrxETH, its staking vault, earns all of the rewards, so it is the
// only one with a yield to track.
export const sfrxeth = liquidStakingListing({
  id: 'sfrxeth',
  name: 'Staked Frax Ether',
  shortName: 'sfrxETH',
  addedAt: UnixTime(1795564800), // 2026-11-25
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: sfrxETH,
      symbol: 'sfrxETH',
      // In frxETH, which Frax's redemption queue pays out one for one in ETH.
      rate: {
        address: sfrxETH,
        method: 'function convertToAssets(uint256) view returns (uint256)',
      },
    },
    // No pool has sold sfrxETH for ETH or WETH since early 2024. It exits by
    // redeeming for frxETH, a second step no quote type covers.
    marketQuotes: [],
  },
})
