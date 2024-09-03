import { Badge } from '../badges'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const wirex: Layer2 = underReviewL2({
  id: 'wirex',
  badges: [Badge.Infra.AggLayer],
  display: {
    name: 'Pay Chain',
    slug: 'wirex',
    category: 'Validium',
    provider: 'Polygon',
    description:
      'Pay Chain is a Validium built on the Polygon CDK stack. It will be used as the infrastructure for the Wirex non-custodial debit cards.',
    purposes: ['Payments'],
    links: {
      websites: ['https://wirexpaychain.com/'],
      apps: ['https://presale.wirexpaychain.com/'],
      documentation: [],
      explorers: [],
      repositories: [],
      socialMedia: [
        'https://x.com/wirexpaychain',
        'https://discord.gg/f8UGp4dH6g',
        'https://wirexpaychain.com/blog',
      ],
    },
  },
})
