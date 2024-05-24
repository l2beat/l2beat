import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const lens: Layer2 = upcomingL2({
  id: 'lens',
  display: {
    name: 'Lens',
    slug: 'lens',
    description:
      "Lens Network is the main social networking hub for the entire user base of Lens Protocol, built using zkSync's ZK Stack technology.",
    purposes: ['Social'],
    category: 'Validium',
    provider: 'ZK Stack',
    links: {
      websites: ['https://lens.xyz'],
      apps: [],
      documentation: ['https://docs.lens.xyz'],
      explorers: ['https://momoka.lens.xyz'],
      repositories: ['https://github.com/lens-protocol'],
      socialMedia: [
        'https://hey.xyz/u/lens',
        'https://x.com/lensprotocol',
        'https://discord.com/invite/lensprotocol',
      ],
    },
  },
})
