import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const powerloom: ScalingProject = underReviewL2({
  id: 'powerloom',
  capability: 'universal',
  addedAt: UnixTime(1745313393),
  display: {
    name: 'Powerloom',
    slug: 'powerloom',
    description:
      'Powerloom Mainnet is the Layer-2 chain supporting Powerloom’s composable data network where devs, orgs, and end-users get access to ready-to-consume, affordable, and verifiable onchain datasets.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://powerloom.io/'],
      documentation: ['https://docs.powerloom.io/'],
      explorers: ['https://explorer.powerloom.network/'],
      repositories: ['https://github.com/powerLoom'],
      socialMedia: [
        'https://x.com/powerloom',
        'https://t.me/PowerLoomProtocol',
        'https://linkedin.com/company/powerloom/',
        'https://youtube.com/@powerloom',
        'https://discord.com/invite/powerloom',
      ],
    },
  },
})
