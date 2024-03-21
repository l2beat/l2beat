import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const bugless: Layer3 = underReviewL3({
  id: 'bugless',
  hostChain: ProjectId('optimism'),
  display: {
    name: 'Bugless',
    slug: 'bugless',
    description:
      'Bugless is a trustless bug bounty platform powered by Cartesi Rollups, designed to address the issues faced by traditional bug bounty programs.',
    purposes: ['Bug bounty'],
    category: 'Optimistic Rollup',
    provider: 'Cartesi Rollups',
    links: {
      documentation: [
        'https://github.com/crypto-bug-hunters/bugless/blob/main/README.md',
      ],
      repositories: ['https://github.com/crypto-bug-hunters/bugless'],
      socialMedia: ['https://twitter.com/BuglessProject'],
      websites: [],
      apps: [],
      explorers: [],
    },
  },
})
