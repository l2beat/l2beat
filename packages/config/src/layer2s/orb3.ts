import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const orb3: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('orb3'),
  display: {
    name: 'ORB3 Protocol',
    slug: 'orb3',
    description: 'SocialFi & GameFI Blockchain Built for Gaming Industry.',
    purpose: 'Universal',
    category: 'Optimium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Arbitrum',
    links: {
      websites: ['https://orb3.tech'],
      apps: [],
      documentation: ['https://docs.orb3.tech'],
      explorers: [
        'https://orb3scan.tech/',
        'https://orb3-protocol.instatus.com/',
      ],
      repositories: ['https://github.com/orb3-protocol'],
      socialMedia: [
        'https://twitter.com/Orb3Tech',
        'https://discord.com/invite/PmWGn2UmdJ',
        'https://mirror.xyz/orb3.eth',
      ],
    },
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
