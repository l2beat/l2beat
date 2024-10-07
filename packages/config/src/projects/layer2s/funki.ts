import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const funki: Layer2 = underReviewL2({
  id: 'funki',
  display: {
    name: 'Funki',
    slug: 'funki',
    description:
      'Funki chain is an L2 Ethereum Rollup Network, powered by the OP Stack.',
    purposes: ['Universal'],
    category: 'Optimium',
    provider: 'OP Stack',
    links: {
      websites: ['https://funkichain.com'],
      apps: ['https://funkichain.com/bridge', 'https://swap.funkichain.com'],
      documentation: ['https://docs.funkichain.com/'],
      explorers: [],
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
