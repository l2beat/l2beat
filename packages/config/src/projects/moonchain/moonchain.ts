import { EthereumAddress, ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const moonchain: ScalingProject = underReviewL3({
  id: 'moonchain',
  capability: 'universal',
  addedAt: UnixTime(1746542403),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'MXCzkEVM Moonchain',
    shortName: 'Moonchain',
    slug: 'moonchain',
    stacks: ['Taiko'],
    description:
      'MXCzkEVM Moonchain is a Layer3 Ethereum-compatible Optimistic Rollup on Arbitrum, focused on data exchange and communication in the IoT DePIN sector.',
    purposes: ['Universal'],
    links: {
      websites: ['https://mchain.ai'],
      bridges: [
        'https://bridge.moonchain.com/',
        'https://miningv2.matchx.io/',
        'https://swap.moonchain.com/',
        'https://nft.moonchain.com/',
      ],
      documentation: ['https://docs.mchain.ai/'],
      explorers: ['https://explorer.moonchain.com'],
      repositories: ['https://github.com/mxczkevm'],
      socialMedia: [
        'https://x.com/Moonchain_com',
        'https://linktr.ee/Moonchain_com',
        'https://medium.com/@Moonchain_com',
        'https://youtube.com/@Moonchain_com',
        'https://tiktok.com/@moonchain_com',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  associatedTokens: ['MXC'],
  chainConfig: {
    name: 'moonchain',
    chainId: 18686,
    explorerUrl: 'https://explorer.moonchain.com',
    sinceTimestamp: UnixTime(1689166261),
    gasTokens: ['MXC'],
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.mxc.com',
        callsPerMinute: 3000,
      },
      { type: 'blockscoutV2', url: 'https://explorer-v1.moonchain.com/api/v2' },
    ],
  },
  escrows: [
    {
      address: EthereumAddress('0x4C3924E619E2eE83cFD565c1432cb621ca8af7A0'),
      sinceTimestamp: UnixTime(1740009589),
      tokens: ['ETH'],
      chain: 'arbitrum',
    },
    {
      address: EthereumAddress('0x3160284BC2F4d7F5b170C70a0Ee0bC5333c7F39e'),
      sinceTimestamp: UnixTime(1740009596),
      tokens: '*',
      chain: 'arbitrum',
    },
  ],
})
