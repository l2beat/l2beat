import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import { underReviewL2 } from './templates/underReview'
import type { Layer2 } from './types'

export const huddle01: Layer2 = underReviewL2({
  id: 'huddle01',
  createdAt: new UnixTime(1737469443), // 2025-01-21T14:24:03+00:00
  display: {
    name: 'Huddle01',
    slug: 'huddle01',
    category: 'Optimium',
    provider: 'Arbitrum',
    description:
      'Huddle01 is an Orbit stack L3 powering the dRTC protocol, a decentralized Real Time Communication Network operating an algorithmic prosumer marketplace for real-time data.',
    purposes: ['Information'],
    links: {
      websites: ['https://huddle01.com/'],
      apps: ['https://huddle01.bridge.caldera.xyz/', 'https://huddle01.app/'],
      documentation: ['https://docs.huddle01.com/docs'],
      explorers: ['https://huddle01.calderaexplorer.xyz/'],
      repositories: [],
      socialMedia: [
        'https://x.com/huddle01com',
        'https://discord.gg/hkYx393Sps',
        'https://t.me/+lVTBdo1s98E1MGJl',
        'https://warpcast.com/huddle01',
        'https://linkedin.com/company/huddle-01/',
        'https://youtube.com/@huddle01com',
      ],
    },
    activityDataSource: 'Blockchain RPC',
  },
  rpcUrl: 'https://huddle01.calderachain.xyz/http',
  escrows: [
    {
      address: EthereumAddress('0x4A346da02EA2Fa6E49834C409165c6D6527ae522'), // bridge
      sinceTimestamp: new UnixTime(1733189165),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xD027882355d26e1891bD9D0B0953536b59e3B263'), // standardGW
      sinceTimestamp: new UnixTime(1733189169),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
