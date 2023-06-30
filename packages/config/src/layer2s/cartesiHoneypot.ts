import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const cartesiHoneypot: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('cartesi-honeypot'),
  display: {
    name: 'Honeypot (Cartesi)',
    slug: 'cartesi-honeypot',
    description:
      'Honeypot is a application specific rollup (roll-app) designed to challenge the security of Cartesi Rollups.\
       Bug hunters are incentivized to hack the application to obtain the funds locked in the rollup contract.\
       Honeypot holds real assets with a dual objective: setting a financial benchmark for secure asset management\
       and providing a gamified battlefield for the community to help audit and test Cartesi Rollups.',
    purpose: 'Bug bounty',
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://cartesi.io/'],
      apps: [],
      documentation: ['https://docs.cartesi.io/cartesi-rollups/'],
      explorers: [],
      repositories: ['https://github.com/cartesi/honeypot'],
      socialMedia: [
        'https://twitter.com/cartesiproject',
        'https://medium.com/cartesi',
        'https://discord.gg/G2tCH5KkcM',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
  milestones: [
    {
      name: 'Honeypot DApp announcement',
      link: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot DApp first announced to the community.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Application-Specific Rollups',
      url: 'https://medium.com/cartesi/application-specific-rollups-e12ed5d9de01',
    },
  ],
}
