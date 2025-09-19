import { UnixTime } from '@l2beat/shared-pure'
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
      documentation: ['https://docs.roninchain.com/'],
      repositories: ['https://github.com/axieinfinity'],
      socialMedia: [
        'https://twitter.com/Ronin_Network',
        'https://discord.gg/roninnetwork',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
