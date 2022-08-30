import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types/bridge'

export const cBridge: BridgeDescription = {
  name: 'Celer V2 cBridge',
  slug: 'cbridge',
  purpose: 'Native Bridge',
  links: {
    websites: ['https://hop.exchange/'],
  },
  bridges: [
    {
      address: '0x5427FEFA711Eff984124bFBB1AB6fbf5E3DA1820',
      sinceTimestamp: new UnixTime(1638346811),
      tokens: [
        'USDC',
        'WETH',
        'USDT',
        'MASK',
        //'LYRA',
        'BUSD',
        //'THALES',
        //'TORN',
      ],
    },
  ],
  connections: [],
}
