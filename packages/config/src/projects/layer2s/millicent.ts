import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const millicent: Layer2 = upcomingL2({
  id: 'millicent',
  display: {
    name: 'Millicent One',
    slug: 'millicent',
    description:
      'Millicent is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is focused on tokenized Real World Assets (RWAs) and digital currencies like tokenized bank deposits, stablecoins, and central bank assets.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://millicent.io/'],
      apps: [],
      documentation: ['https://docs.millicent.io'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/MillicentLabs'],
    },
  },
})
