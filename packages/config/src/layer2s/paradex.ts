import { EthereumAddress, ProjectId } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('paradex')

export const paradex: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('paradex'),
  display: {
    name: 'Paradex',
    slug: 'paradex',
    description:
      'Paradex is a high-performance crypto-derivatives exchange built on a Starknet Appchain.',
    purpose: 'Exchange',
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.paradex.trade/'],
      apps: ['https://app.paradex.trade'],
      documentation: ['https://docs.paradex.trade/'],
      explorers: [],
      repositories: ['https://github.com/tradeparadex'],
      socialMedia: ['https://twitter.com/tradeparadex'],
    },
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xE3cbE3A636AB6A754e9e41B12b09d09Ce9E53Db3'),
        tokens: ['USDC'],
        description: 'Paradex USDC Escrow.',
      }),
    ],
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
