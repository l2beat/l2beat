import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const polynetworkBridge: BridgeDescription = {
  name: 'Polynetwork Bridge',
  slug: 'polynetworkbridge',
  validation: 'LC Token Bridge',
  links: {
    websites: ['https://poly.network/'],
  },
  escrows: [
    {
      address: '0x250e76987d838a75310c34bf422ea9f1AC4Cc906',
      sinceTimestamp: new UnixTime(1599099893),
      tokens: [
        'ETH',
        'USDT',
        'USDC',
        // 'COW',
        'WBTC',
        'DAI',
        'UNI',
        //'SHIBA',
        'renBTC',
        'FEI',
      ],
    },
  ],
  connections: [],
}
