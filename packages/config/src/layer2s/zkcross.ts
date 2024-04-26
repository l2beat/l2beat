import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const zkcross: Layer2 = upcomingL2({
  id: 'zkcross',
  display: {
    name: 'ZKCross',
    slug: 'zkcross',
    description:
      'ZKCross is at the forefront of the Layer 2 revolution, working on zkWasm based layer 2 end to end solution, offering dApp SDK, sequencer, wasm contract executor and some other relevant zkWasm compatible services for developers to build zk-provable applications.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://www.zkcross.org'],
      apps: [],
      documentation: ['https://docs.zkcross.org'],
      explorers: [],
      repositories: ['https://github.com/zkcrossteam'],
      socialMedia: [
        'https://twitter.com/thezkcross',
        'https://discord.gg/URr9aNCr',
      ],
    },
  },
})
