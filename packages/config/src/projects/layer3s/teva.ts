import { ProjectId, UnixTime } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const teva: Layer3 = underReviewL3({
  id: 'teva',
  createdAt: new UnixTime(1717416738), // 2024-06-03T12:12:18Z
  hostChain: ProjectId('zksync2'),
  display: {
    name: 'Teva Chain',
    slug: 'teva',
    category: 'ZK Rollup',
    description:
      'Teva Chain is a L3 gaming hyperchain on ZKsync, powered by zkStack with custom DA.',
    purposes: ['Gaming'],
    provider: 'ZK Stack',
    links: {
      websites: ['https://tevaera.com/tevachain'],
      apps: [''],
      documentation: [''],
      explorers: [''],
      repositories: [''],
      socialMedia: [
        'https://twitter.com/tevaera',
        'https://discord.com/invite/tevaera',
        'https://tevaera.medium.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
})
