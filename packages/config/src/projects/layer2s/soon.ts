import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const soon: Layer2 = underReviewL2({
  id: 'soon',
  createdAt: new UnixTime(1726836904), // 2024-09-20T12:55:04Z
  display: {
    name: 'Soon Mainet',
    slug: 'soon',
    description:
      'SOON is a Layer 2 chain built on top of the SOON Stack, which itself is based on the OP Stack, but introduces the Decoupled Solana Virtual Machine (SVM).',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://soo.network/'],
      apps: ['https://bridge.mainnet.soo.network/home'],
      documentation: ['https://docs.soo.network/introduction/what-is-soon'],
      explorers: ['https://explorer.soo.network/'],
      repositories: ['https://github.com/soonlabs'],
      socialMedia: [
        'https://x.com/soon_svm',
        'https://discord.gg/soon-svm',
        'https://medium.com/@soon_SVM',
      ],
    },
    // no activityDataSource due to SVM
  },
  escrows: [
    {
      address: EthereumAddress('0x5a0702c7ebbec83802b35db737fccdc5fc6c5e07'), // optimismPortal
      sinceTimestamp: new UnixTime(1735877303),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
