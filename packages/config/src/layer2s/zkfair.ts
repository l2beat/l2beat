import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('zkfair')

export const zkfair: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('zkfair'),
  display: {
    name: 'ZKFair',
    slug: 'zkfair',
    description:
      'ZKFair is the first community Validium based on Polygon CDK and Celestia DA, championing fairness.',
    purpose: 'Universal',
    category: 'Validium',
    dataAvailabilityMode: 'NotApplicable',
    provider: 'Polygon',
    links: {
      websites: ['https://zkfair.io/'],
      apps: ['https://wallet.zkfair.io/'],
      documentation: ['https://docs.zkfair.io/'],
      explorers: ['https://scan.zkfair.io/'],
      repositories: ['https://github.com/ZKFair'],
      socialMedia: ['https://twitter.com/ZKFCommunity'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x9cb4706e20A18E59a48ffa7616d700A3891e1861'),
        sinceTimestamp: new UnixTime(1702879283),
        tokens: '*',
      }),
    ],
  },
  stage: {
    stage: 'NotApplicable',
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
  milestones: [
    {
      name: 'ZKFair Mainnet is Live',
      link: 'https://twitter.com/ZKFCommunity/status/1737307444181869017',
      date: '2023-12-20T00:00:00Z',
      description: 'ZKFair launched.',
    },
  ],
}
