import { ProjectId, UnixTime } from '@l2beat/types'

import { Bridge } from './types'

export const ronin: Bridge = {
  id: ProjectId('ronin'),
  display: {
    name: 'Ronin',
    slug: 'ronin',
    links: {
      websites: ['https://bridge.roninchain.com/'],
    },
  },
  config: {
    associatedTokens: ['AXS'],
    escrows: [
      {
        address: '0x1A2a1c938CE3eC39b6D47113c7955bAa9DD454F2', // old bridge
        sinceTimestamp: new UnixTime(1611575595),
        tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
      },
      {
        address: '0x64192819Ac13Ef72bF6b5AE239AC672B43a9AF08', // new bridge
        sinceTimestamp: new UnixTime(1655883630),
        tokens: ['ETH', 'AXS', 'WETH', 'USDC', 'USDT', 'MATIC', 'LINK'],
      },
    ],
  },
  technology: {
    type: 'Lock-Mint',
    validation: 'EV Token Bridge',
    destination: ['Axie Infinity Chain'],
    connections: [],
  },
  riskView: {
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
}
