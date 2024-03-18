import { ProjectId } from '@l2beat/shared-pure'

import { underReviewL3 } from '../layer2s/templates/underReview'
import { Layer3 } from './types'

export const mxc: Layer3 = underReviewL3({
  id: 'mxc',
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MXC zkEVM',
    slug: 'mxc',
    provider: 'Taiko zkEVM',
    description:
      'The MXC zkEVM is an IoT-centric zk-rollup solution on Arbitrum based on Taiko zkEVM. It offers type-1 EVM equivalence, ensuring opcode-level compatibility with the Ethereum Virtual Machine.',
    purposes: ['Universal', 'IoT'],
    // provider: 'taiko',
    category: 'ZK Rollup',
    links: {
      websites: ['https://mxc.org/'],
      apps: ['https://mxc.org/datadash-app'],
      documentation: ['https://doc.mxc.com/'],
      explorers: ['https://explorer.mxc.com/'],
      repositories: ['https://github.com/MXCzkEVM'],
      socialMedia: [
        'https://twitter.com/MXCfoundation',
        'https://discord.gg/mxcfoundation',
        'https://t.me/mxcfoundation',
        'https://linkedin.com/company/mxc-foundation/',
        'https://facebook.com/MXCfoundation/',
        'https://youtube.com/c/MXCFoundation',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
})
