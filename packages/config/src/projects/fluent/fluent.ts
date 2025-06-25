import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const fluent: ScalingProject = upcomingL2({
  id: 'fluent',
  capability: 'universal',
  addedAt: UnixTime(1721218971), // 2024-07-17T12:22:51Z
  display: {
    name: 'Fluent',
    slug: 'fluent',
    description:
      'Fluent is an Ethereum L2 that blends Wasm, EVM and SVM-based smart contracts into a unified execution environment.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://fluent.xyz/'],
      documentation: ['https://docs.fluent.xyz/'],
      repositories: ['https://github.com/fluentlabs-xyz'],
      bridges: ['https://faucet.dev.gblend.xyz/'],
      explorers: ['https://blockscout.dev.gblend.xyz'],
      socialMedia: [
        'https://x.com/fluentxyz',
        'https://linkedin.com/company/fluentxyz',
        'https://discord.com/invite/fluentxyz',
      ],
    },
  },
})
