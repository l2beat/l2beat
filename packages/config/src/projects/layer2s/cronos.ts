import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const cronos: Layer2 = upcomingL2({
  id: 'cronos',
  display: {
    name: 'Cronos zkEVM',
    slug: 'cronos',
    description:
      "Cronos zkEVM is an Ethereum Layer-2 scaling solution that leverages zkSync's ZK Stack, extending the existing portfolio of Cronos apps.",
    purposes: ['Universal'],
    category: 'ZK Rollup',
    provider: 'ZK Stack',
    links: {
      websites: ['https://cronos.org/'],
      apps: [],
      documentation: ['https://docs.cronos.org/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://twitter.com/cronos_chain'],
    },
  },
})
