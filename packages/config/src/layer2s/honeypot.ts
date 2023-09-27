import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('honeypot')

export const honeypot: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('honeypot'),
  display: {
    name: 'Honeypot (Cartesi)',
    slug: 'cartesi-honeypot',
    description:
      'Honeypot is a application specific rollup designed to challenge the security of Cartesi Rollups.\
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
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x0974CC873dF893B302f6be7ecf4F9D4b1A15C366'),
        tokens: '*',
        description: 'Contract storing bounty funds.',
      }),
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
  milestones: [
    {
      name: 'Honeypot announcement',
      link: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot first announced to the community.',
    },
    {
      name: 'Honeypot launch',
      link: 'https://x.com/cartesiproject/status/1706685141421047982',
      date: '2023-07-26T00:00:00Z',
      description: 'Honeypot launched on mainnet.',
    },
  ],
  knowledgeNuggets: [
    {
      title: 'Application-Specific Rollups',
      url: 'https://medium.com/cartesi/application-specific-rollups-e12ed5d9de01',
    },
  ],
}
