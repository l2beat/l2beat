import { ProjectId } from '@l2beat/shared-pure'

import { Layer3 } from './types'

export const xai: Layer3 = {
  isUpcoming: true,
  type: 'layer3',
  id: ProjectId('xai'),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Xai',
    slug: 'xai',
    description:
      'Xai is an Ethereum Layer-3 that leverages Arbitrum AnyTrust to enable open trade in the next generation of video games.',
    purpose: 'Gaming',
    category: 'Optimium',
    provider: 'Arbitrum Orbit',
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
  },
}
