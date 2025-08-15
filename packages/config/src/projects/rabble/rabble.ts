import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const rabble: ScalingProject = upcomingL3({
  id: 'rabble',
  capability: 'universal',
  addedAt: UnixTime(1755155703),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Rabble',
    slug: 'rabble',
    description:
      'Rabble is a Layer 3 on Arbitrum, built on the Orbit stack. It serves as your crypto playground, where users can connect, explore, and unlock unlimited earning potential through decentralized applications.',
    purposes: ['Universal'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://rabble.pro/'],
      explorers: ['https://rabble-chain-testnet.explorer.caldera.xyz/'],
      bridges: ['https://portal.caldera.xyz/bridge/rabble-chain-testnet'],
      socialMedia: [
        'https://x.com/0xRabble',
        'https://linkedin.com/company/rabble-labs/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
