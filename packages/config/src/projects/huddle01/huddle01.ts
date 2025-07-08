import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import { BADGES } from '../../common/badges'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const huddle01: ScalingProject = underReviewL3({
  id: 'huddle01',
  capability: 'universal',
  addedAt: UnixTime(1737469443), // 2025-01-21T14:24:03+00:00
  hostChain: ProjectId('arbitrum'),
  badges: [
    BADGES.RaaS.Caldera,
    BADGES.L3ParentChain.Arbitrum,
    BADGES.DA.DAC,
    BADGES.Stack.Orbit,
    BADGES.VM.EVM,
  ],
  display: {
    name: 'Huddle01',
    slug: 'huddle01',
    category: 'Optimium',
    stacks: ['Arbitrum'],
    description:
      'Huddle01 is an Orbit stack L3 powering the dRTC protocol, a decentralized Real Time Communication Network operating an algorithmic prosumer marketplace for real-time data.',
    purposes: ['Information'],
    links: {
      websites: ['https://huddle01.com/'],
      bridges: [
        'https://huddle01.bridge.caldera.xyz/',
        'https://huddle01.app/',
      ],
      documentation: ['https://docs.huddle01.com/docs'],
      explorers: ['https://huddle01.calderaexplorer.xyz/'],
      socialMedia: [
        'https://x.com/huddle01com',
        'https://discord.gg/hkYx393Sps',
        'https://t.me/+lVTBdo1s98E1MGJl',
        'https://warpcast.com/huddle01',
        'https://linkedin.com/company/huddle-01/',
        'https://youtube.com/@huddle01com',
      ],
    },
  },
  chainConfig: {
    name: 'huddle01',
    chainId: 12323,
    gasTokens: ['ETH'],
    apis: [
      {
        type: 'rpc',
        url: 'https://huddle01.calderachain.xyz/http',
        callsPerMinute: 1500,
      },
    ],
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  escrows: [
    {
      address: EthereumAddress('0x4A346da02EA2Fa6E49834C409165c6D6527ae522'), // bridge
      sinceTimestamp: UnixTime(1733189165),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0xD027882355d26e1891bD9D0B0953536b59e3B263'), // standardGW
      sinceTimestamp: UnixTime(1733189169),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
