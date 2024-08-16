import { ProjectId } from '@l2beat/shared-pure'
import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const bugbuster: Layer3 = underReviewL3({
  id: 'bugbuster',
  hostChain: ProjectId('optimism'),
  display: {
    name: 'Bug Buster',
    slug: 'bugbuster',
    description:
      'Bug Buster is a trustless, open source bug bounty platform for web3, powered by Cartesi.',
    purposes: ['Bug bounty'],
    category: 'Optimistic Rollup',
    provider: 'Cartesi Rollups',
    links: {
      documentation: [
        'https://github.com/crypto-bug-hunters/bug-buster/blob/main/README.md',
      ],
      repositories: ['https://github.com/crypto-bug-hunters/bug-buster'],
      socialMedia: [
        'https://x.com/BugBusterApp',
        'https://t.me/+G_CPMEhCHC04MzA5',
      ],
      websites: ['https://bugbuster.app/'],
      apps: [],
      explorers: [
        'https://optimism.cartesiscan.io/applications/0x9cb6c6e904ce6bf3ca6d0002b9629acce74ea89b',
      ],
    },
  },
})
