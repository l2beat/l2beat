import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { Layer3 } from '../../types'
import { upcomingL3 } from '../layer2s/templates/upcoming'

export const slingshot: Layer3 = upcomingL3({
  id: 'slingshot',
  capability: 'universal',
  addedAt: new UnixTime(1740738600),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'Slingshot',
    slug: 'slingshot',
    category: 'Optimium',
    stack: 'Arbitrum',
    description:
      'Slingshot is a Roblox AI Game Launcher built on Arbitrum, allowing users to bet on and interact with next-generation AI-powered games.',
    purposes: ['AI', 'Gaming'],
    links: {
      websites: ['https://slingshotdao.com/'],
      apps: ['https://app.slingshotdao.com/'],
      documentation: ['https://docs.slingshotdao.com/'],
      explorers: ['https://explorer-slingshot-uivc8ajsjn.t.conduit.xyz/'],
      socialMedia: [
        'https://x.com/SlingShotDAO',
        'https://t.me/SlingShotDAOGC',
        'https://discord.com/invite/slingshotdao',
      ],
    },
  },
})
