import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const intmax: Layer2 = upcomingL2({
  id: 'intmax',
  display: {
    name: 'INTMAX',
    slug: 'intmax',
    description:
      'INTMAX is a stateless Plasma-like ZK Rollup with permissionless block production.',
    purposes: ['Payments'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://intmax.io/'],
      apps: [],
      documentation: [
        'https://eprint.iacr.org/2023/1082.pdf',
        'https://medium.com/intmax/the-deep-dive-into-statelessness-intmax2-algorithm-was-published-be7a306048ff',
      ],
      explorers: [],
      repositories: ['https://github.com/InternetMaximalism'],
      socialMedia: ['https://twitter.com/intmaxIO'],
    },
  },
})
