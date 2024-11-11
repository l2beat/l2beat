import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const morph: Layer2 = underReviewL2({
  id: 'morph',
  createdAt: new UnixTime(1702295992), // 2023-12-11T11:59:52Z
  display: {
    name: 'Morph',
    slug: 'morph',
    description:
      'Morph is an EVM compatible rollup. It operates as an optimistic rollup with ZK fault proofs.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    links: {
      websites: ['https://morphl2.io'],
      apps: ['https://bridge-holesky.morphl2.io'],
      documentation: ['https://docs.morphl2.io'],
      explorers: ['https://explorer-holesky.morphl2.io'],
      repositories: ['https://github.com/morph-l2'],
      socialMedia: [
        'https://twitter.com/MorphL2',
        'https://t.me/MorphL2official',
        'https://medium.com/@morphlayer2',
        'https://discord.com/invite/L2Morph',
        'https://youtube.com/@morphofficiall2',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0xDc71366EFFA760804DCFC3EDF87fa2A6f1623304'),
      sinceTimestamp: new UnixTime(1729307111),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x44c28f61A5C2Dd24Fc71D7Df8E85e18af4ab2Bd8'),
      sinceTimestamp: new UnixTime(1729307651),
      tokens: '*',
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xA534BAdd09b4C62B7B1C32C41dF310AA17b52ef1'),
      sinceTimestamp: new UnixTime(1729307783),
      tokens: '*',
      source: 'external',
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0xc9045350712A1DCC3A74Eca18Bc985424Bbe7535'),
      sinceTimestamp: new UnixTime(1729308239),
      tokens: ['USDC'],
      source: 'external',
      chain: 'ethereum',
    },
  ],
})
