import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const gravity: Bridge = {
  id: ProjectId('gravity'),
  name: 'Gravity',
  slug: 'gravity',
  type: 'Lock-Mint',
  destination: ['Cosmos'],

  validation: 'Bridge',
  links: {
    websites: ['https://bridge.roninchain.com/'],
  },
  escrows: [
    {
      address: '0xa4108aA1Ec4967F8b52220a4f7e94A8201F2D906',
      sinceTimestamp: new UnixTime(1639416372),
      tokens: ['USDC', 'WETH', 'DAI'],
    },
  ],
  connections: [],
}
