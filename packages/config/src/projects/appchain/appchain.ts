import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const appchain: ScalingProject = underReviewL2({
  id: 'appchain',
  addedAt: UnixTime(1744635768), // 2025-04-14T14:42:48Z
  capability: 'universal',
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.Stack.Orbit,
    BADGES.DA.DAC,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Appchain',
    slug: 'appchain',
    description:
      'AppChain is an incentivized Layer 2 that allows developers to capture the value their dApps create, enabling sustainable economic models.',
    purposes: ['Universal'],
    category: 'Optimium',
    stack: 'Arbitrum',
    links: {
      websites: ['https://appchain.xyz/'],
      documentation: ['https://docs.appchain.xyz/'],
      explorers: ['https://explorer.appchain.xyz/'],
      apps: ['https://bridge.appchain.xyz/'],
      socialMedia: [
        'https://x.com/onappchain',
        'https://warpcast.com/onappchain',
        'https://discord.com/invite/kntTtZXM4M',
      ],
    },
  },
  chainConfig: {
    name: 'appchain',
    chainId: 466,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.appchain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
    adjustCount: { type: 'SubtractOne' },
  },
  escrows: [
    {
      address: EthereumAddress('0x19df42E085e2c3fC4497172E412057F54D9f013E'), // bridge
      sinceTimestamp: UnixTime(1731057011),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
