import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { Layer2 } from '../../internalTypes'
import { BADGES } from '../badges'
import { underReviewL2 } from './templates/underReview'

export const superseed: Layer2 = underReviewL2({
  id: 'superseed',
  capability: 'universal',
  addedAt: UnixTime(1714316238), // 2024-04-28T14:57:18Z
  badges: [
    BADGES.Infra.Superchain,
    BADGES.DA.EthereumBlobs,
    BADGES.Stack.OPStack,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Superseed',
    slug: 'superseed',
    description:
      'Superseed is an Optimistic Rollup utilizing the OP Stack, aiming to provide a CDP lending platform enshrined in the protocol and redistribution of Layer 2 fees to its users.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    stack: 'OP Stack',
    links: {
      websites: ['https://superseed.xyz/'],
      apps: ['https://bridge.superseed.xyz/'],
      documentation: ['https://docs.superseed.xyz/'],
      explorers: ['https://explorer.superseed.xyz/'],
      socialMedia: [
        'https://x.com/SuperseedXYZ',
        'https://discord.com/invite/vjDDB5S4BN',
        'https://mirror.xyz/superseedxyz.eth',
      ],
    },
  },
  chainConfig: {
    name: 'superseed',
    chainId: 5330,
    apis: [
      {
        type: 'rpc',
        url: 'https://mainnet.superseed.xyz/',
        callsPerMinute: 1500,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    adjustCount: { type: 'SubtractOne' },
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x2c2150aa5c75A24fB93d4fD2F2a895D618054f07'), // optiPortal
      sinceTimestamp: UnixTime(1726179731),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
    // uses hyperlane for ERC-20s
  ],
})
