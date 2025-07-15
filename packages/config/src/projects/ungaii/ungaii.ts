import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const ungaii: ScalingProject = upcomingL3({
  id: 'ungaii',
  capability: 'universal',
  addedAt: UnixTime(1739539175),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Ungaii',
    slug: 'ungaii',
    description:
      'Ungaii Chain, along with its game publishing, arm Ungaii brings over 13 years experience in gaming deal making and a network of large userbase gaming companies onto web3.',
    purposes: ['Gaming'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://ungaii.io/'],
      bridges: [
        'https://ungaii-chain-testnet.hub.caldera.xyz/',
        'https://ungaii-chain-testnet.bridge.caldera.xyz/',
      ],
      documentation: [],
      repositories: [],
      explorers: ['https://ungaii-chain-testnet.explorer.caldera.xyz/'],
      socialMedia: [
        'https://x.com/UngaiiChain',
        'https://discord.com/invite/maAnU2xDqg',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
