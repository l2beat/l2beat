import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const zircuit: Layer2 = upcomingL2({
  id: 'zircuit',
  display: {
    name: 'Zircuit',
    slug: 'zircuit',
    description:
      'Zircuit aims to develop an universal ZK Rollup based on the Optimism Bedrock architecture, and employing AI to identify and stop malicious transactions at the sequencer level.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
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
