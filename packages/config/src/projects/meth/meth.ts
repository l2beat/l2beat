import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

export const meth = liquidStakingListing({
  id: 'meth',
  name: 'mETH Protocol',
  addedAt: UnixTime(1795564800), // 2026-11-25
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: ChainSpecificAddress(
        'eth:0xd5F7838F5C461fefF7FE49ea5ebaF7728bB0ADfa',
      ),
      symbol: 'mETH',
      // The staking contract that mints and burns mETH.
      rate: {
        address: ChainSpecificAddress(
          'eth:0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f',
        ),
        method: 'function mETHToETH(uint256) view returns (uint256)',
      },
    },
    marketQuotes: [{ type: 'uniswapV3', fee: 500 }],
  },
})
