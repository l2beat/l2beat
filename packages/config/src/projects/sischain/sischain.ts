import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const sischain: ScalingProject = underReviewL2({
  id: ProjectId('sischain'),
  addedAt: UnixTime(1753778036),
  capability: 'universal',
  display: {
    name: 'SIS Chain',
    slug: 'sischain',
    description:
      'The SIS Chain is purpose-built for cross-chain activity – with fast execution, simple tooling, and native token utility at its core.',
    category: 'Optimistic Rollup',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://symbiosis.finance'],
      documentation: ['https://docs.symbiosis.finance/'],
      explorers: ['https://explorer.symbiosis.finance/'],
      bridges: ['https://app.symbiosis.finance/bridge'],
      socialMedia: [
        'https://x.com/symbiosis_fi',
        'https://t.me/symbiosis_finance',
        'https://discord.com/invite/ymbRx6ADvR',
        'https://linkedin.com/company/symbiosis-finance',
      ],
    },
  },
  chainConfig: {
    name: 'sischain',
    chainId: 13863860,
    apis: [
      {
        type: 'rpc',
        url: 'https://symbiosis.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
})
