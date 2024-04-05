import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const zircuit: Layer2 = upcomingL2({
  id: 'zircuit',
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit is an optimistic rollup built on the OP Stack and utilizes the Halo2 proof system, employing AI to stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://zircuit.com/'],
      apps: ['https://bridge.zircuit.com/'],
      documentation: ['https://docs.zircuit.com/'],
      explorers: ['https://explorer.zircuit.com/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/ZircuitL2',
        'https://discord.com/invite/zircuit',
      ],
    },
  },
})
