import { upcoming } from './templates/upcoming'
import { Layer2 } from './types'

export const parallel: Layer2 = upcoming({
  id: 'parallel',
  display: {
    name: 'Parallel',
    slug: 'parallel',
    headerWarning: '',
    description:
      'Parallel will launch an Ethereum L2 solution utilizing Arbitrum Nitro technology. More information coming soon.',
    purpose: 'Universal, DeFi',
    category: 'Optimistic Rollup',
    provider: 'Arbitrum',
    links: {
      websites: ['https://parallel.fi'],
      apps: ['https://parallel.fi/airdrop'],
      documentation: ['https://docs.parallel.fi/parallel-chain/overview'],
      explorers: [
        'https://explorerl2new-surprised-harlequin-bonobo-fvcy2k9oqh.t.conduit.xyz/',
      ],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ParallelFi',
        'https://discord.gg/rdjVz8zavF',
        'https://t.me/parallelfi_community',
      ],
    },
  },
})
