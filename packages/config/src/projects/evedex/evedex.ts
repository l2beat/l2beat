import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const evedex: ScalingProject = upcomingL3({
  id: 'evedex',
  capability: 'universal',
  addedAt: UnixTime(1739503948),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'EVEDEX',
    slug: 'evedex',
    description:
      'EVEDEX is a Perpetual DEX & Next-Gen Web3 financial ecosystem built on its own L3 blockchain.',
    purposes: ['Exchange'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://evedex.com/'],
      explorers: ['https://explorer.evedex.com'],
      bridges: ['https://demo-exchange.evedex.com/'],
      documentation: ['https://evedex.com/en-US/contracts/'],
      repositories: [],
      socialMedia: [
        'https://x.com/EveDexOfficial',
        'https://discord.gg/evedex',
        'https://t.me/OfficialEveDex',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
