import { UnixTime } from '@l2beat/types'

import { BridgeDescription } from './types'

export const roninBridge: BridgeDescription = {
  name: 'Ronin Bridge',
  slug: 'roninbridge',
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
