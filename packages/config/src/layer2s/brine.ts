import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('brine')

export const brine: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('brine'),
  display: {
    name: 'Brine',
    slug: 'brine',
    description: 'Brine is a DEX powered by StarkEx.',
    purpose: 'Exchange',
    category: 'Validium',
    provider: 'StarkEx',
    links: {
      websites: ['https://www.brine.fi/'],
      apps: ['https://trade.brine.fi/'],
      documentation: ['https://docs.brine.fi/'],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://twitter.com/BrineFinance',
        'https://discord.gg/wMAnf3gVTh',
      ],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x1390f521A79BaBE99b69B37154D63D431da27A07'),
        sinceTimestamp: new UnixTime(1657453320),
        tokens: '*',
        description: "Main entry point for users' deposits.",
        // add upgradability
      }),
    ],
  },
  stage: {
    stage: 'UnderReview',
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
