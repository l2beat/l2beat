import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

export const stader = liquidStakingListing({
  id: 'stader',
  name: 'Stader',
  addedAt: UnixTime(1795564800), // 2026-11-25
  // ETHx only: Stader's other tokens stake other assets.
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: ChainSpecificAddress(
        'eth:0xA35b1B31Ce002FBF2058D22F30f95D405200A15b',
      ),
      symbol: 'ETHx',
      // The stake pools manager, which mints ETHx at the oracle's rate.
      rate: {
        address: ChainSpecificAddress(
          'eth:0xcf5EA1b38380f6aF39068375516Daf40Ed70D299',
        ),
        method: 'function getExchangeRate() view returns (uint256)',
      },
    },
    marketQuotes: [
      {
        type: 'curve',
        pool: ChainSpecificAddress(
          'eth:0x59Ab5a5b5d617E478a2479B0cAD80DA7e2831492',
        ),
        i: 1,
        j: 0,
      },
    ],
  },
})
