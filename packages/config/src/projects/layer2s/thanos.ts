import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from '../../common'
import { Layer2 } from './types'

export const thanos: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('thanos'),
  display: {
    name: 'THANOS',
    slug: 'thanos',
    description:'Thanos L2 solution specializes in building and maintaining customized Layer 2 networks using Optimistic Rollup technology. By utilizing its native token within the L2 network, it enables the creation of tailored Layer 2 environments where the token is used for transactions, offering a more efficient and cost-effective blockchain experience.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OVM',
    links: {
      websites: ['https://tokamak.network/'],
      apps: [],
      documentation: ['https://docs.tokamak.network/'],
      explorers: ['https://explorer.thanos-sepolia.tokamak.network/'],
      repositories: ['https://github.com/tokamak-network/tokamak-thanos'],
      socialMedia: [
        'https://t.me/tokamak_network',
        'https://discord.gg/FuwksZQQ7r',
        'https://twitter.com/Tokamak_Network',
        'https://medium.com/tokamak-network',
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
