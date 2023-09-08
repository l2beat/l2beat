import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  subtractOne,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('kroma')

export const kroma: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('kroma'),
  display: {
    name: 'Kroma',
    slug: 'kroma',
    description:
      'Kroma aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture. \
            Currently, Kroma operates as an Optimistic Rollup with ZK fault proofs, utilizing a zkEVM based on Scroll. \
            The goal of Kroma is to eventually transition to a ZK Rollup once the generation of ZK proofs becomes more cost-efficient and faster.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://kroma.network/'],
      apps: ['https://kroma.network/bridge/'],
      documentation: ['https://docs.kroma.network/'],
      explorers: ['https://blockscout.kroma.network/'],
      repositories: ['https://github.com/kroma-network/'],
      socialMedia: [
        'https://discord.gg/kroma',
        'https://twitter.com/kroma_network',
        'https://medium.com/@kroma-network',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  stage: {
    stage: 'UnderReview',
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0x31F648572b67e60Ec6eb8E197E1848CC5F5558de'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x827962404D7104202C5aaa6b929115C8211d9596'),
        sinceTimestamp: new UnixTime(1693880555),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://api.kroma.network',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
