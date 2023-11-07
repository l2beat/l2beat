import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, TECHNOLOGY, UPCOMING_RISK_VIEW } from './common'
import { Layer2 } from './types'

export const blockspot: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('blockspot'),
  display: {
    name: 'BlockSpot',
    slug: 'blockspot',
    description: 'DEX,Launchpad, Cross Chain Token Bridge & LP Pool.',
    purpose: 'Universal',
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://blockspot.tech'],
      apps: [],
      documentation: ['https://docs.blockspot.tech'],
      explorers: [
        'https://test.blockspotscan.tech/',
        'https://blockspot.instatus.com/',
      ],
      repositories: ['https://github.com/BlockSpotL2'],
      socialMedia: [
        'https://twitter.com/L2_BlockSpot',
        'https://discord.gg/4mVtZrKCeS',
        'https://mirror.xyz/0x28100FB105bc41766A09C7cd02f7f1875f061E87',
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
