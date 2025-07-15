import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const creatorchain: ScalingProject = upcomingL2({
  id: 'creatorchain',
  capability: 'universal',
  addedAt: UnixTime(1740170319),
  display: {
    name: 'Creator Chain',
    slug: 'creatorchain',
    description:
      'Creator is a Layer 2 blockchain built on the OP Stack. Creator is designed for speed, affordability, and scalability, it empowers developers with revenue-sharing smart contracts and incentivizes users with exclusive Phantom X NFTs that generate ongoing profits.',
    purposes: ['Universal', 'NFT'],
    category: 'Optimistic Rollup',
    stacks: ['OP Stack'],
    links: {
      websites: ['https://creatorchain.io/'],
      bridges: ['https://bridge.creatorchain.io/'],
      documentation: ['https://docs.creatorchain.io/'],
      explorers: ['https://explorer.creatorchain.io/'],
      socialMedia: [
        'https://x.com/buildoncreator',
        'https://discord.com/invite/39yKXyJr8F',
        'https://t.me/BuildOnCreator',
        'https://linkedin.com/company/builoncreator',
        'https://creatorchain.medium.com/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
