import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const telos: Layer2 = upcomingL2({
  id: 'telos',
  display: {
    name: 'Telos',
    slug: 'telos',
    description:
      'Telos L2 will leverage the SNARKtor decentralized protocol for scalable SNARKs verification unlocking massively scalable users data protecting applications, regulator compliance and trustless interoperability.',
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
