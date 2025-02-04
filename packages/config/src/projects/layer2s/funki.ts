import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../types'
import { underReviewL2 } from './templates/underReview'

export const funki: Layer2 = underReviewL2({
  id: 'funki',
  capability: 'universal',
  addedAt: new UnixTime(1728289959), // 2024-10-07T08:32:39Z
  display: {
    name: 'Funki',
    slug: 'funki',
    description:
      'Funki chain is an OP Stack Optimium on Ethereum reimagining the blockchain experience as an interconnected world brimming with wonder, adventure, and fun.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'OP Stack',
    links: {
      websites: ['https://funkichain.com'],
      apps: ['https://funkichain.com/bridge', 'https://swap.funkichain.com'],
      documentation: ['https://docs.funkichain.com/'],
      explorers: ['https://funkiscan.io/'],
      repositories: ['https://github.com/funkichain'],
      socialMedia: [
        'https://x.com/funkichain',
        'https://facebook.com/funkichain',
        'https://instagram.com/funkichain',
        'https://t.me/funkichain',
      ],
    },
  },
  escrows: [
    {
      chain: 'ethereum',
      address: EthereumAddress('0x5C9C7f98eD153a2deAA981eB5C97B31744AccF22'), // OptiPortal
      sinceTimestamp: new UnixTime(1721212775),
      tokens: ['ETH'],
    },
    {
      chain: 'ethereum',
      address: EthereumAddress('0xA2C1C1A473250094a6244F2bcf6Cb51F670Ad3aC'), // L1StandardBridge
      sinceTimestamp: new UnixTime(1721212799),
      tokens: '*',
    },
  ],
})
