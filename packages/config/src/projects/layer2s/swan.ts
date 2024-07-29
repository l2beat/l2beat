import { EthereumAddress } from '@l2beat/shared-pure'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

const discovery = new ProjectDiscovery('swan')

export const swan: Layer2 = underReviewL2({
  id: 'swan',
  display: {
    name: 'Swan Chain',
    slug: 'swan',
    description:
      'Swan Chain is an OP Stack L2 that aims to provide comprehensive AI infrastructure on the blockchain.',
    purposes: ['AI', 'Storage'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://swanchain.io/'],
      apps: ['https://bridge.swanchain.io/'],
      documentation: ['https://docs.swanchain.io/'],
      explorers: [
        'https://mainnet-explorer.swanchain.io/',
        'https://swanscan.io/',
      ],
      repositories: ['https://github.com/swanchain'],
      socialMedia: [
        'https://x.com/swan_chain',
        'https://t.me/swan_chain/',
        'https://discord.gg/swanchain',
        'https://www.linkedin.com/company/swancloud',
        'https://swanchain.medium.com/',
      ],
    },
  },
  escrows: [
    discovery.getEscrowDetails({
      // OptimismPortal
      address: EthereumAddress('0xBa50434BC5fCC07406b1baD9AC72a4CDf776db15'),
      tokens: ['ETH'],
    }),
  ],
})
