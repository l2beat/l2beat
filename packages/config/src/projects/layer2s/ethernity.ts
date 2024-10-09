import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const ethernity: Layer2 = upcomingL2({
  id: 'ethernity',
  createdAt: new UnixTime(1718182472), // 2024-06-12T08:54:32Z
  display: {
    name: 'Ethernity',
    slug: 'ethernity',
    description:
      'Ethernity is an Ethereum L2 leveraging the OP stack and focusing on entertainment.',
    purposes: ['Universal', 'AI'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://ethernity.io/'],
      apps: ['https://app.ethernity.io/'],
      documentation: [
        'https://drive.google.com/file/d/1o74ZBmYMIUa8QUwvLOK7KhoXP9-LCsPf/view',
      ],
      explorers: ['https://ethplorer.io/'],
      repositories: [],
      socialMedia: [
        'https://x.com/EthernityChain',
        'https://ethernitychain.medium.com/',
      ],
    },
  },
})
