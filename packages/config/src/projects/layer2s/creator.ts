import { UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { upcomingL2 } from './templates/upcoming'

export const creator: Layer2 = upcomingL2({
  id: 'creator',
  capability: 'universal',
  addedAt: new UnixTime(1724863689), // 2024-08-28T16:48:09Z
  display: {
    name: 'Creator',
    slug: 'creator',
    description:
      'The CREATOR chain will leverage exclusive relationships with successful Web 2 platforms to generate new user onboarding strategies. To attract and retain users, CREATOR will offer personalized DeFi services for creators and position itself as the premier Web 2.5 hub and a one-stop shop for new entrants to crypto.',
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    stack: 'ZK Stack',
    links: {
      websites: ['https://oncreator.com/'],
      socialMedia: ['https://x.com/oncreator_'],
    },
  },
})
