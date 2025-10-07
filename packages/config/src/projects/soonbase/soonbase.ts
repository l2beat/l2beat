import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const soonbase: ScalingProject = underReviewL2({
  id: 'soonbase',
  capability: 'universal',
  addedAt: UnixTime(1754641504),
  proofSystem: {
    type: 'Optimistic',
  },
  display: {
    name: 'soonBase',
    slug: 'soonbase',
    description:
      "soonBase is a Layer 2 chain built on top of the SOON Stack. It innovates with a Decoupled SVM that separates Solana's execution from its consensus, yielding performance and flexibility improvements.",
    purposes: ['Universal'],
    links: {
      websites: ['https://soo.network/'],
      bridges: ['https://bridge.soo.network/home?chain=2'],
      documentation: ['https://docs.soo.network/introduction/what-is-soon'],
      explorers: ['https://explorer.soonbase.soo.network'],
      repositories: ['https://github.com/soonlabs'],
      socialMedia: [
        'https://x.com/soon_svm',
        'https://discord.gg/soon-svm',
        'https://medium.com/@soon_SVM',
      ],
    },
  },
  dataAvailability: undefined,
  chainConfig: {
    name: 'soonbase',
    chainId: undefined,
    apis: [
      {
        type: 'svm-rpc',
        url: 'https://rpc.soonbase.soo.network/rpc',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'slot',
    startSlot: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x77E1064021182066eF94A2C8eEAd051eaD08D161'),
      sinceTimestamp: UnixTime(1744968425),
      tokens: ['ETH'],
      chain: 'base',
    },
    {
      address: EthereumAddress('0x5430D17d11D76A04cF1FC3f1C8ed648c212cDda6'),
      sinceTimestamp: UnixTime(1744968435),
      tokens: '*',
      chain: 'base',
    },
  ],
})
