import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const cronoszkevm: Layer2 = underReviewL2({
  id: 'cronoszkevm',
  display: {
    tvlWarning: {
      content:
        'The TVL is currently shared among all projects using the shared ZK stack contracts. See ZKsync Era TVL.',
      sentiment: 'warning',
    },
    name: 'Cronos zkEVM',
    slug: 'cronoszkevm',
    description:
      'Cronos zkEVM is an Ethereum Layer-2 scaling solution built on ZK Stack, extending the existing portfolio of Cronos apps and chains.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://cronos.org/zkevm'],
      apps: ['https://zkevm.cronos.org/bridge'],
      documentation: ['https://docs-zkevm.cronos.org/'],
      explorers: ['https://explorer.zkevm.cronos.org/testnet'],
      repositories: [],
      socialMedia: [
        'https://x.com/cronos_chain',
        'https://discord.com/invite/cronos',
      ],
    },
  },
  // shared escrow with zk stack
})
