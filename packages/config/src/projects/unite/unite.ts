import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const unite: ScalingProject = underReviewL3({
  id: 'unite',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1722863398), // 2024-08-05T13:09:58Z
  hostChain: ProjectId('base'),
  display: {
    name: 'Unite',
    slug: 'unite',
    description:
      'Unite Blockchain is a revolutionary Layer 3 (L3) EVM-compatible blockchain, designed to transform the landscape of mobile web3 gaming. It is the first L3 blockchain solution for Mass-Market Mobile Games.',
    purposes: ['Gaming'],
    stacks: ['Arbitrum'],
    links: {
      documentation: ['https://unite-1.gitbook.io/unite-docs'],
      socialMedia: ['https://x.com/uniteio'],
      websites: ['https://unite.io/'],
      explorers: ['https://unite-mainnet.explorer.alchemy.com/'],
      bridges: [
        'https://bridge.arbitrum.io/?sourceChain=unite-mainnet&destinationChain=base&tab=bridge',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  chainConfig: {
    name: 'unite',
    gasTokens: ['UNITE'],
    chainId: 88899,
    apis: [],
  },
})
