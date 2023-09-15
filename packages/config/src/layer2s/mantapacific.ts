import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import {
  CONTRACTS,
  subtractOne,
  TECHNOLOGY,
  UNDER_REVIEW_RISK_VIEW,
} from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('mantapacific')

export const mantapacific: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('mantapacific'),
  display: {
    name: 'Manta Pacific',
    slug: 'mantapacific',
    description:
      'Manta Pacific is an optimistic rollup empowering EVM-native zero-knowledge (ZK) applications and general dapps with a scalable, cost-effective environment to deploy simply using Solidity. Manta Pacific plans to eventually leverage Celestia for data availability to lower gas costs for users across all applications in its ecosystem.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://pacific.manta.network/'],
      apps: ['https://pacific-bridge.manta.network/'],
      documentation: ['https://docs.manta.network/'],
      explorers: ['https://pacific-explorer.manta.network/'],
      repositories: ['https://github.com/Manta-Network'],
      socialMedia: [
        'https://discord.gg/mantanetwork',
        'https://twitter.com/MantaNetwork',
        'https://medium.com/@mantanetwork',
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
        address: EthereumAddress('0x9168765EE952de7C6f8fC6FaD5Ec209B960b7622'),
        sinceTimestamp: new UnixTime(1694224871),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0x3B95bC951EE0f553ba487327278cAc44f29715E5'),
        sinceTimestamp: new UnixTime(1694224907),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 token that do not require custom gateway.',
      }),
    ],
    transactionApi: {
      type: 'rpc',
      startBlock: 1,
      url: 'https://pacific-rpc.manta.network/http',
      callsPerMinute: 1500,
      assessCount: subtractOne,
    },
  },
  riskView: UNDER_REVIEW_RISK_VIEW,
  technology: TECHNOLOGY.UNDER_REVIEW,
  contracts: CONTRACTS.UNDER_REVIEW,
}
