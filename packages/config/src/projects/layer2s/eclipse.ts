import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const eclipse: Layer2 = underReviewL2({
  id: 'eclipse',
  display: {
    name: 'Eclipse',
    slug: 'eclipse',
    description:
      'Eclipse is a Layer 2 powered by the Solana Virtual Machine (SVM).',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://eclipse.builders/'],
      apps: ['https://bridge.eclipse.builders/'],
      documentation: ['https://docs.eclipse.builders/'],
      explorers: ['https://explorer.eclipse.xyz/'],
      repositories: [],
      socialMedia: [
        'https://twitter.com/eclipsefnd',
        'https://discord.gg/eclipse-labs',
        'https://mirror.xyz/eclipsemainnet.eth',
      ],
    },
  },
  // rpcUrl: 'https://mainnetbeta-rpc.eclipse.xyz', custom VM, i guess it's different
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0xd7e4b67e735733ac98a88f13d087d8aac670e644'),
      sinceTimestamp: new UnixTime(1722140987),
      tokens: ['ETH'],
    },
  ],
})
