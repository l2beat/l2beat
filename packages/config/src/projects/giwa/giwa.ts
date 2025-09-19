import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const giwa: ScalingProject = upcomingL2({
  id: 'giwa',
  capability: 'universal',
  addedAt: UnixTime(1757639162),
  display: {
    name: 'GIWA',
    slug: 'giwa',
    description:
      'GIWA is an Ethereum Layer 2 blockchain built on the OP Stack, with ETH as the gas token. Built by Upbit, it aims to serve as a bridge connecting more users, data, and liquidity to the broader Web3 ecosystem.',
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://giwa.io/'],
      bridges: ['https://faucet.giwa.io/'],
      documentation: ['https://docs.giwa.io/'],
      repositories: ['https://github.com/giwa-io'],
      explorers: ['https://sepolia-explorer.giwa.io/'],
      socialMedia: [],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
