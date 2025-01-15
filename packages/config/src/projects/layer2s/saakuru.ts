import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const saakuru: Layer2 = upcomingL2({
  id: 'saakuru',
  createdAt: new UnixTime(1737091216), // 2025-01-14T10:40:16Z
  display: {
    name: 'Saakuru',
    slug: 'saakuru',
    description:
      'Saakuru is a user-focused L2 protocol built on the OP Stack, offering zero transaction fees through a delegate model that eliminates gas costs.',
    purposes: ['Gaming'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://saakuru.com/'],
      apps: ['https://saakuru.com/portal'],
      documentation: ['https://source.saakuru.com/saakuru-source-v2'],
      explorers: ['https://explorer.saakuru.network/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/saakuru_labs',
        'https://discord.com/invite/saakuruprotocol',
        'https://t.me/aagventures',
        'https://linkedin.com/company/saakurulabs',
        'https://medium.com/@saakuru',
        'https://youtube.com/@saakuru_labs',
      ],
    },
  },
})