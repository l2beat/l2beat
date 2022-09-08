import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const nearBridge: BridgeDescription = {
  name: 'Near Rainbow Bridge',
  slug: 'nearbridge',
  validation: 'LC Token Bridge',
  links: {
    websites: ['https://near.org/bridge/'],
  },
  associatedTokens: ['AURORA'],
  escrows: [
    {
      address: '0x23Ddd3e3692d1861Ed57EDE224608875809e127f',
      sinceTimestamp: new UnixTime(1615826693),
      tokens: [
        'DAI',
        'USDC',
        'AURORA',
        'USDT',
        'WBTC',
        // PLY,
        // OCT
      ],
    },
  ],
  connections: [],
}
