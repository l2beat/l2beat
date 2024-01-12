import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const ola: Layer2 = upcoming({
  id: 'ola',
  display: {
    name: 'Ola',
    slug: 'ola',
    description:
      'Ola is an open source hybrid ZK Rollup that delivers programmable scalability and data ownership (Privacy) to blockchain ecosystems.',
    purposes: ['Privacy'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.olavm.org/'],
      apps: [],
      documentation: ['https://ola-2.gitbook.io/ola-developer-documents/'],
      explorers: [],
      repositories: ['https://github.com/Sin7Y'],
      socialMedia: [
        'https://twitter.com/ola_zkzkvm',
        'https://discord.com/invite/vDFy7YEG6j',
        'https://www.linkedin.com/company/olavm-technology-ltd/',
        'https://hackmd.io/@sin7y',
        'https://medium.com/@ola_zkzkvm',
        'https://www.youtube.com/@Ola_Sin7y',
      ],
    },
  },
})
