import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const ronin: Bridge = {
  id: ProjectId('ronin'),
  name: 'Ronin',
  slug: 'ronin',
  type: 'Lock-Mint',
  validation: 'EV Token Bridge',
  destination: ['Axie Infinity Chain'],
  risks: {
    validation: {
      value: 'External',
      description: '5/9 MultiSig',
      sentiment: 'bad',
    },
    sourceUpgradeability: {
      value: 'YES',
      description: 'Gateway Proxy can be upgraded by a single EOA address.',
      sentiment: 'bad',
    },
    destinationToken: {
      value: '???',
      description: 'Info not available yet',
      sentiment: 'warning',
    },
  },
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
