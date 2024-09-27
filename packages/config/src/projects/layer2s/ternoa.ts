import { Badge } from '../badges'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const ternoa: Layer2 = upcomingL2({
  id: 'ternoa',
  badges: [Badge.Infra.AggLayer],
  display: {
    name: 'Ternoa',
    slug: 'ternoa',
    description:
      'Ternoa is a modular Validium leveraging Polygon CDK, Avail, and AggLayer to achieve enhanced functionality.',
    purposes: ['Universal'],
    category: 'Validium',
    provider: 'Polygon',
    links: {
      websites: ['https://ternoa.network/'],
      apps: [],
      documentation: ['https://docs.ternoa.network/learn/ternoa-zkevm+'],
      explorers: [],
      repositories: ['https://github.com/capsule-corp-ternoa'],
      socialMedia: [
        'https://x.com/ternoa_',
        'https://t.me/ternoa',
        'https://discord.com/invite/cNZTGtGJNR',
        'https://linkedin.com/company/ternoa/mycompany/',
        'https://youtube.com/channel/UCUYvbtRE5HoWPz7z88V7Khw',
      ],
    },
  },
})
