//todo: adds notes to Notion
import { ProjectId } from '@l2beat/shared'

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
       and providing a gamified battlefield for the community to help audit and test Cartesi Rollups.\
       ',
    purpose: 'Bug bounty',
    links: {
      websites: ['https://docs.cartesi.io/cartesi-rollups/'], // TODO
      apps: [], // Ok
      documentation: ['https://docs.cartesi.io/cartesi-rollups/'], // Ok
      explorers: [], // Ok
      repositories: [], // TODO
      socialMedia: ['https://discord.gg/du7emFSt'], // Ok
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: { ...TECHNOLOGY.UPCOMING, category: 'Optimistic Rollup' },
  contracts: CONTRACTS.EMPTY,
  milestones: [
    {
      name: 'Honeypot DApp announcement',
      link: 'https://medium.com/cartesi/cartesi-ecosystem-update-2023-124b384401cc#:~:text=Honeypot%20DApp%20on%20Mainnet',
      date: '2023-04-11T00:00:00Z',
      description: 'Honeypot DApp first announced to the community.',
    },
  ],
}
