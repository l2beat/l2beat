import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const kroma: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('kroma'),
  display: {
    name: 'Kroma',
    slug: 'kroma',
    description:
      'Kroma aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture. \
            Currently, Kroma operates as an Optimistic Rollup with ZK fault proofs, utilizing a zkEVM based on Scroll. \
            The goal of Kroma is to eventually transition to a ZK Rollup once the generation of ZK proofs becomes more cost-efficient and faster. \
            Kroma is deployed on the Sepolia testnet for further testing and optimization.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'Optimism',
    links: {
      websites: ['https://kroma.network/'],
      apps: [
        'https://kroma.network/bridge/',
        'https://uniswap.sepolia.kroma.network/#/swap/',
      ],
      documentation: ['https://docs.kroma.network/'],
      explorers: ['https://blockscout.sepolia.kroma.network/'],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.gg/kroma',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: TECHNOLOGY.UPCOMING,
  contracts: CONTRACTS.EMPTY,
}
