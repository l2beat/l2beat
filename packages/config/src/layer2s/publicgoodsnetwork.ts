import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'

import { ProjectDiscovery } from '../discovery/ProjectDiscovery'
import { CONTRACTS, TECHNOLOGY, UNDER_REVIEW_RISK_VIEW } from './common'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('publicgoodsnetwork')

export const publicgoodsnetwork: Layer2 = {
  isUnderReview: true,
  type: 'layer2',
  id: ProjectId('publicgoodsnetwork'),
  display: {
    name: 'Public Goods Network',
    slug: 'publicgoodsnetwork',
    description:
      'Public Goods Network is an OP stack chain focused on funding public goods.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'Optimism',
    links: {
      websites: ['https://publicgoods.network/'],
      apps: ['https://bridge.publicgoods.network/'],
      documentation: ['https://docs.publicgoods.network/'],
      explorers: ['https://explorer.publicgoods.network'],
      repositories: [
        'https://github.com/supermodularxyz/pgn-monorepo',
        'https://github.com/supermodularxyz/pgn-docs',
      ],
      socialMedia: ['https://twitter.com/pgn_eth'],
    },
  },
  config: {
    escrows: [
      discovery.getEscrowDetails({
        address: EthereumAddress('0xb26Fd985c5959bBB382BAFdD0b879E149e48116c'),
        sinceTimestamp: new UnixTime(1686068903),
        tokens: ['ETH'],
        description: 'Main entry point for users depositing ETH.',
        // add upgradability
      }),
      discovery.getEscrowDetails({
        address: EthereumAddress('0xD0204B9527C1bA7bD765Fa5CCD9355d38338272b'),
        sinceTimestamp: new UnixTime(1624401464),
        tokens: '*',
        description:
          'Main entry point for users depositing ERC20 tokens that do not require custom gateway.',
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
