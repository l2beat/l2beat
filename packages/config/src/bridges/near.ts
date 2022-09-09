import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const near: Bridge = {
  id: ProjectId('near'),
  name: 'Near Rainbow Bridge',
  slug: 'near',
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
