import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const creator: Layer2 = upcomingL2({
  id: 'creator',
  display: {
    name: 'Creator',
    slug: 'creator',
    description:
      'The CREATOR chain will leverage exclusive relationships with successful Web 2 platforms to generate new user onboarding strategies. To attract and retain users, CREATOR will offer personalized DeFi services for creators and position itself as the premier Web 2.5 hub and a one-stop shop for new entrants to crypto.',
    purposes: ['Universal', 'Gaming'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://oncreator.com/'],
      apps: [],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: ['https://x.com/oncreator_'],
    },
  },
})
