import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const slingshot: ScalingProject = upcomingL3({
  id: 'slingshot',
  capability: 'universal',
  addedAt: UnixTime(1740738600),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Slingshot',
    slug: 'slingshot',
    category: 'Optimium',
    stacks: ['Arbitrum'],
    description:
      'Slingshot is a Roblox AI Game Launcher built on Arbitrum, allowing users to bet on and interact with next-generation AI-powered games.',
    purposes: ['AI', 'Gaming'],
    links: {
      websites: ['https://slingshotdao.com/'],
      bridges: ['https://app.slingshotdao.com/'],
      documentation: ['https://docs.slingshotdao.com/'],
      explorers: ['https://explorer-slingshot-uivc8ajsjn.t.conduit.xyz/'],
      socialMedia: [
        'https://x.com/SlingShotDAO',
        'https://t.me/SlingShotDAOGC',
        'https://discord.com/invite/slingshotdao',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
