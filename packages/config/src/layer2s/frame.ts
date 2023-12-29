import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const frame: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('frame'),
  display: {
    name: 'Frame',
    slug: 'frame',
    description:
      'Frame is an Ethereum L2 designed to scale NFT adoption across the Ethereum ecosystem utilizing Arbitrum Nitro technology.',
    purpose: 'Universal, NFT',
    category: 'Optimistic Rollup',
    dataAvailabilityMode: 'TxData',
    provider: 'Arbitrum',
    links: {
      websites: ['https://www.frame.xyz/'],
      apps: [],
      documentation: ['https://www.docs.frame.xyz/'],
      explorers: ['https://explorer.testnet.frame.xyz/'],
      repositories: ['https://github.com/frame-network'],
      socialMedia: [
        'https://twitter.com/frame_xyz',
        'https://discord.gg/framexyz',
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
