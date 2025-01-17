import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { subtractOne } from '../../common/assessCount'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const corn: Layer2 = underReviewL2({
  id: 'corn',
  createdAt: new UnixTime(1733880840),
  display: {
    name: 'Corn',
    slug: 'corn',
    category: 'Optimium',
    provider: 'Arbitrum',
    description:
      'Corn is an Orbit Stack-based Layer 2 chain focused on Bitcoin-centric DeFi applications. Corn uses Bitcorn (BTCN) as its gas token, the popCORN System for long-term incentives, and LayerZero for cross-chain asset transfers.',
    purposes: ['Universal'],
    links: {
      websites: ['https://usecorn.com/'],
      apps: ['https://usecorn.com/app'],
      documentation: ['https://docs.usecorn.com/'],
      explorers: ['https://cornscan.io/'],
      repositories: ['https://github.com/usecorn'],
      socialMedia: [
        'https://x.com/use_corn',
        'https://discord.com/invite/usecorn',
        'https://blog.usecorn.com/',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://mainnet.corn-rpc.com',
  escrows: [
    {
      address: EthereumAddress('0x00943b11764176C3a8323aEFCBd6fE70CFb6272d'),
      sinceTimestamp: new UnixTime(1733880840),
      tokens: ['WBTC'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x957c9dc25de6b8e46a7fa0d081ba749dd005b54f'),
      sinceTimestamp: new UnixTime(1733880840),
      tokens: ['cbBTC'],
      chain: 'ethereum',
    },
  ],
})
