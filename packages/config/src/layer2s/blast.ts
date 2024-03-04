import { EthereumAddress } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { underReview } from './templates/underReview'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('blast')

export const blast: Layer2 = underReview({
  id: 'blast',
  display: {
    name: 'Blast',
    slug: 'blast',
    description:
      'Blast is an EVM-compatible Optimistic Rollup supporting native yield.',
    purposes: ['Universal', 'DeFi'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://blast.io/en'],
      apps: ['https://blast.io/en/airdrop/early-access'],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/Blast_L2'],
    },
  },
  escrows: [
    discovery.getEscrowDetails({
      address: EthereumAddress('0x98078db053902644191f93988341E31289E1C8FE'),
      description:
        'Destination for transitioning funds from the old bridge after mainnet launch.',
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x697402166Fbf2F22E970df8a6486Ef171dbfc524'),
      tokens: '*',
    }),
    discovery.getEscrowDetails({
      address: EthereumAddress('0x5F6AE08B8AeB7078cf2F96AFb089D7c9f51DA47d'),
      description: 'Pre-launch Blast bridge.',
      tokens: '*',
    }),
  ],
})
