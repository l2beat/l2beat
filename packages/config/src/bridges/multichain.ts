import { ProjectId, UnixTime } from '@l2beat/types'

import * as config from './multichain-config.json'
import { Bridge } from './types'

export const multichain: Bridge = {
  type: 'bridge',
  id: ProjectId('multichain'),
  display: {
    name: 'Multichain',
    slug: 'multichain',
    description:
      'Multichain is an externally validated bridge. It uses a network of nodes running SMPC (Secure Multi Party Computation) protocol. It supports dozens of blockchains and thousands of tokens with both Token Bridge and Liquidity Network.',
    links: {
      websites: ['https://multichain.xyz/'],
    },
  },
  config: {
    escrows: config.escrows.map((escrow) => ({
      address: escrow.address,
      sinceTimestamp: new UnixTime(escrow.sinceTimestamp),
      tokens: escrow.tokens,
    })),
  },
  technology: {
    category: 'Lock-Mint OR Swap',
    destination: config.destinations,
  },
  riskView: {
    validation: {
      value: 'External',
      description: '2/3rd of MPC.',
      sentiment: 'bad',
    },
    destinationToken: {
      value: 'Custom Multichain or anyToken',
      description:
        'Depending on the router configuration either Multichain tokens or anyToken is minted.',
    },
  },
}
