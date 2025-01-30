import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const singularityfinance: Layer2 = upcomingL2({
  id: 'singularityfinance',
  capability: 'universal',
  addedAt: new UnixTime(1732266303), // 2024-11-22T09:05:03Z
  display: {
    name: 'Singularity Finance',
    slug: 'singularity-finance',
    description:
      'Singularity Finance is an EVM compatible Layer 2 blockchain which brings the AI economy onchain. It offers a compliant RWA tokenisation framework to tokenise AI compute and monetise AI agents.',
    purposes: ['AI', 'RWA'],
    category: 'Validium',
    links: {
      websites: ['https://singularityfinance.ai'],
      documentation: ['https://docs.singularityfinance.ai'],
      socialMedia: [
        'https://t.me/Singularity_Fi',
        'https://x.com/Singularity_Fi',
      ],
    },
  },
})
