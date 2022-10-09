import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const gravity: Bridge = {
  type: 'bridge',
  id: ProjectId('gravity'),
  display: {
    name: 'Gravity',
    slug: 'gravity',
    links: {
      websites: ['https://bridge.roninchain.com/'],
    },
  },
  config: {
    escrows: [
      {
        address: '0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906',
        sinceTimestamp: new UnixTime(1639416372),
        tokens: ['USDC', 'WETH', 'DAI'],
      },
    ],
  },
  technology: {
    category: 'Token Bridge',
    destination: ['Cosmos'],
  },
}
