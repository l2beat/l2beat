import { UnixTime } from '@l2beat/shared-pure'
import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const telos: Layer2 = upcomingL2({
  id: 'telos',
  createdAt: new UnixTime(1718018621), // 2024-06-10T11:23:41Z
  display: {
    name: 'Telos zkEVM',
    slug: 'telos',
    description:
      'Telos zkEVM is an upcoming ZK-based scaling solution on Ethereum, powered by SNARKtor decentralized proof aggregation and developed by Telos.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://zkevm.telos.net/'],
      apps: [],
      documentation: [
        'https://docs.telos.net/overview/what-is-telos/introduction/',
      ],
      explorers: [],
      repositories: ['https://github.com/telosnetwork'],
      socialMedia: [
        'https://x.com/HelloTelos',
        'https://discord.com/invite/telos',
        'https://youtube.com/@TheTelosNetwork',
      ],
    },
  },
})
