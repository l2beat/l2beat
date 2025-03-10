import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from './templates/upcoming'

export const network3: ScalingProject = upcomingL2({
  id: 'network3',
  capability: 'universal',
  addedAt: UnixTime(1721807029), // 2024-07-24T07:43:49Z
  display: {
    name: 'Network3',
    slug: 'network3',
    description:
      'An AIoT ScalingProject Empowering Efficient Model Training & Validation.',
    purposes: ['AI', 'Privacy'],
    category: 'Validium',
    links: {
      websites: ['https://network3.io/'],
      documentation: [
        'https://litepaper.network3.ai/~/changes/0jJxEcDKtGZ0s8Ew29KS',
      ],
      socialMedia: [
        'https://x.com/network3_ai',
        'https://discord.gg/q4cHgxZUCH',
        'https://t.me/network3official',
      ],
    },
  },
})
