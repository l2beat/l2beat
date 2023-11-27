import { ProjectId } from '@l2beat/shared-pure'

import { CONTRACTS, UPCOMING_RISK_VIEW } from './common'
import { nova } from './nova'
import { Layer2 } from './types'

export const xai: Layer2 = {
  isUpcoming: true,
  type: 'layer2',
  id: ProjectId('xai'),
  display: {
    name: 'Xai',
    slug: 'xai',
    description:
      'Xai is an Ethereum Layer-3 that leverages Arbitrum AnyTrust to enable open trade in the next generation of video games.',
    purpose: 'Gaming',
    category: 'Optimium',
    provider: 'Arbitrum',
    links: {
      websites: ['https://xai.games/'],
      apps: [],
      documentation: ['https://xai-foundation.gitbook.io/xai-network/'],
      explorers: [],
      repositories: ['https://github.com/OffchainLabs/nitro'],
      socialMedia: [
        'https://twitter.com/xai_games',
        'https://t.me/XaiSentryNodes',
        'https://discord.gg/xaigames',
      ],
    },
    activityDataSource: 'Blockchain RPC',
    dataAvailabilityMode: 'NotApplicable',
  },
  stage: {
    stage: 'NotApplicable',
  },
  config: {
    escrows: [],
  },
  riskView: UPCOMING_RISK_VIEW,
  technology: nova.technology,
  contracts: CONTRACTS.EMPTY,
}
