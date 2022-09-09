import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const ronin: Bridge = {
  id: ProjectId('ronin'),
  name: 'Ronin',
  slug: 'ronin',
  validation: 'EV Token Bridge',
  links: {
    websites: ['https://bridge.roninchain.com/'],
  },
  associatedTokens: ['AXS'],
  escrows: [
    {
      address: '0x1A2a1c938CE3eC39b6D47113c7955bAa9DD454F2',
      sinceTimestamp: new UnixTime(1611575595),
      tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
    },
  ],
  connections: [],
}
