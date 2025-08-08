import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const soonbase: ScalingProject = underReviewL2({
  id: 'soonbase',
  capability: 'universal',
  addedAt: UnixTime(1754641504),
  display: {
    name: 'soonBase',
    slug: 'soonbase',
    category: 'Optimium',
    description:
      "soonBase is a Layer 2 chain built on top of the SOON Stack. It innovates with a Decoupled SVM that separates Solana's execution from its consensus, yielding performance and flexibility improvements.",
    purposes: ['Universal'],
    links: {
      websites: ['https://soo.network/'],
      bridges: ['https://bridge.soo.network/home?chain=2'],
      explorers: ['https://explorer.soonbase.soo.network'],
      socialMedia: [
        'https://x.com/soon_svm',
        'https://discord.gg/soon-svm',
        'https://medium.com/@soon_SVM',
      ],
    },
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
