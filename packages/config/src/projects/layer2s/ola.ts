import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const ola: Layer2 = upcomingL2({
  id: 'ola',
  capability: 'universal',
  addedAt: new UnixTime(1705060311), // 2024-01-12T11:51:51Z
  display: {
    name: 'Ola',
    slug: 'ola',
    description:
      'Ola is an open source hybrid ZK Rollup that delivers programmable scalability and data ownership to blockchain ecosystems.',
    purposes: ['Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://olavm.org/'],
      documentation: ['https://ola-2.gitbook.io/ola-developer-documents/'],
      repositories: ['https://github.com/Sin7Y'],
      socialMedia: [
        'https://twitter.com/ola_zkzkvm',
        'https://discord.com/invite/vDFy7YEG6j',
        'https://linkedin.com/company/olavm-technology-ltd/',
        'https://hackmd.io/@sin7y',
        'https://medium.com/@ola_zkzkvm',
        'https://youtube.com/@Ola_Sin7y',
      ],
    },
  },
})
