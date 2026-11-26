import { ChainSpecificAddress, UnixTime } from '@l2beat/shared-pure'
import { liquidStakingListing } from '../../templates/liquidStakingListing'

const swETH = ChainSpecificAddress(
  'eth:0xf951E335afb289353dc249e82926178EaC7DEd78',
)

export const sweth = liquidStakingListing({
  id: 'sweth',
  name: 'Swell swETH',
  shortName: 'swETH',
  addedAt: UnixTime(1795564800), // 2026-11-25
  tvl: { source: 'l2beat' },
  tracking: {
    contracts: {
      type: 'rate',
      token: swETH,
      symbol: 'swETH',
      rate: {
        address: swETH,
        method: 'function getRate() view returns (uint256)',
      },
    },
    marketQuotes: [
      { type: 'uniswapV3', fee: 500 },
      { type: 'pancakeV3', fee: 500 },
    ],
  },
})
