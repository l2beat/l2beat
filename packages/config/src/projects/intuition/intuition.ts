import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const intuition: ScalingProject = upcomingL3({
  id: 'intuition',
  capability: 'universal',
  addedAt: UnixTime(1759624683),
  hostChain: ProjectId('base'),
  hasTestnet: true,
  display: {
    name: 'Intuition',
    slug: 'intuition',
    description:
      'Intuition Testnet is the first public deployment of our network—an Ethereum L3 built with Arbitrum Orbit for cross-chain interop—moving us one step closer to the vision outlined in our roadmap of becoming the Data Liquidity Layer for the Internet.',
    purposes: ['Universal'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://intuition.systems'],
      bridges: ['https://testnet.bridge.intuition.systems'],
      documentation: ['https://docs.intuition.systems'],
      repositories: ['https://github.com/0xintuition'],
      explorers: ['https://testnet.explorer.intuition.systems'],
      socialMedia: [
        'https://linkedin.com/company/0xintuition',
        'https://twitter.com/0xintuition',
        'https://youtube.com/@0xIntuition',
        'https://discord.gg/0xintuition',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
})
