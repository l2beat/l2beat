import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { Bridge } from './types'

export const chainport: Bridge = {
  type: 'bridge',
  id: ProjectId('chainport'),
  display: {
    name: 'Chainport',
    slug: 'chainport',
    description: 'ChainPort Cross-Chain Bridge: Port Safely across 15+ Chains.',
    category: 'Token Bridge',
    links: {
      websites: ['https://www.chainport.io/'],
    },
  },
  config: {
    escrows: [
      {
        address: EthereumAddress('0x7B8FDfCf79E72a9a8e656958647D139C0e16EA19'),
        sinceTimestamp: new UnixTime(1627979440),
        tokens: ['*'],
      },
      {
        address: EthereumAddress('0x763A0CA93AF05adE98A52dc1E5B936b89bF8b89a'),
        sinceTimestamp: new UnixTime(1626949825),
        tokens: ['*'],
      },
    ],
  },
  technology: {
    destination: ['Optimism', 'Arbitrum', 'Polygon', 'BSC', 'Avax', 'Ethereum', 'Fuse', 'Fantom', 'Moonriver', 'Aurora', 'Cardano', 'Dogechain', 'Telos', 'Milkomeda', 'Conflux', 'Base', 'Meld', 'opBNB'],
  },
}
