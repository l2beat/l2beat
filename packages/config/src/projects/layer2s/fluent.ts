import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const fluent: Layer2 = upcomingL2({
  id: 'fluent',
  createdAt: new UnixTime(1721218971), // 2024-07-17T12:22:51Z
  display: {
    name: 'Fluent',
    slug: 'fluent',
    description:
      'Fluent is an Ethereum L2 that blends Wasm, EVM and SVM-based smart contracts into a unified execution environment.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://fluentlabs.xyz/'],
      apps: [],
      documentation: ['https://docs.fluentlabs.xyz/learn'],
      explorers: [],
      repositories: ['https://github.com/fluentlabs-xyz'],
      socialMedia: [
        'https://x.com/fluentxyz',
        'https://linkedin.com/company/fluentxyz',
        'https://discord.com/invite/fluentlabs',
      ],
    },
  },
})
