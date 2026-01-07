import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const singularityfinance: ScalingProject = upcomingL2({
  id: 'singularityfinance',
  capability: 'universal',
  addedAt: UnixTime(1732266303), // 2024-11-22T09:05:03Z
  display: {
    name: 'Singularity Finance',
    slug: 'singularity-finance',
    description:
      'Singularity Finance is an EVM compatible Layer 2 blockchain which brings the AI economy onchain. It offers a compliant RWA tokenisation framework to tokenise AI compute and monetise AI agents.',
    purposes: ['AI', 'RWA'],
    links: {
      websites: ['https://singularityfinance.ai'],
      documentation: ['https://docs.singularityfinance.ai'],
      repositories: ['https://github.com/Singularity-DAO'],
      socialMedia: [
        'https://t.me/Singularity_Fi',
        'https://x.com/Singularity_Fi',
      ],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
