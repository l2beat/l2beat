import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const frame: ScalingProject = upcomingL2({
  id: 'frame',
  capability: 'universal', // 'Frame team bought by Igloo Inc. in June 2024. Will contricute to Abstract network. Links no longer work'
  addedAt: UnixTime(1695904849), // 2023-09-28T12:40:49Z
  display: {
    name: 'Frame',
    slug: 'frame',
    description:
      'Frame is an Ethereum L2 designed to scale NFT adoption across the Ethereum ecosystem utilizing Arbitrum Nitro technology.',
    purposes: ['Universal', 'NFT'],
    category: 'Optimistic Rollup',
    stack: 'Arbitrum',
    links: {
      websites: ['https://frame.xyz/'],
      documentation: ['https://docs.frame.xyz/'],
      explorers: ['https://explorer.testnet.frame.xyz/'],
      repositories: ['https://github.com/frame-network'],
      socialMedia: [
        'https://twitter.com/frame_xyz',
        'https://discord.gg/framexyz',
      ],
    },
  },
})
