import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const roninNetwork: ScalingProject = upcomingL2({
  id: 'ronin-network',
  capability: 'universal',
  addedAt: UnixTime(1754639625),
  display: {
    name: 'Ronin',
    slug: 'ronin-network',
    description:
      "Ronin is an Ethereum L2 running the OP rollup stack built for gaming. The network's key innovation is offering high throughput and low fees optimized for NFT transactions and in-game economies, powering ecosystems like Axie Infinity.",
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://roninchain.com/'],
      bridges: ['https://app.roninchain.com/bridge'],
      documentation: ['https://docs.roninchain.com/'],
      repositories: ['https://github.com/axieinfinity'],
      explorers: ['https://app.roninchain.com/explorer'],
      socialMedia: [
        'https://twitter.com/Ronin_Network',
        'https://discord.gg/roninnetwork',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
