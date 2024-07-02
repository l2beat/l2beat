import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'

import { subtractOne } from '../../common/assessCount'
import { underReviewL2 } from './templates/underReview'
import { Layer2 } from './types'

export const alienx: Layer2 = underReviewL2({
  id: 'alienx',
  display: {
    name: 'AlienX',
    slug: 'alienx',
    category: 'Optimium',
    provider: 'Arbitrum',
    description:
      'AlienX is an Orbit stack Optimium on Ethereum focused on Gaming, AI and NFTs.',
    purposes: ['AI', 'Gaming', 'NFT'],
    links: {
      websites: ['https://alienxchain.io/'],
      apps: ['https://bridge.alienxchain.io/', 'https://alienswap.xyz/'],
      documentation: ['https://docs.alienxchain.io'],
      explorers: ['https://explorer.alienxchain.io'],
      repositories: [],
      socialMedia: [
        'https://x.com/ALIENXchain',
        'https://discord.gg/alienxchain',
        'https://medium.com/@ALIENXchain',
        'https://t.me/alienx_ainode',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  // rpcUrl: 'https://rpc.alienxchain.io/http',
  transactionApi: {
    type: 'rpc',
    startBlock: 1,
    defaultUrl: 'https://rpc.alienxchain.io/http',
    defaultCallsPerMinute: 1500,
    assessCount: subtractOne,
  },
  escrows: [
    {
      address: EthereumAddress('0x69aB55146Bc52A0b31F74dBDc527b8B7e9c7C27c'),
      sinceTimestamp: new UnixTime(1717630139),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    {
      address: EthereumAddress('0x5625d2a46fc582b3e6dE5288D9C5690B20EBdb8D'),
      sinceTimestamp: new UnixTime(1717630163),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
