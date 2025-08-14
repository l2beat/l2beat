import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const kontos: ScalingProject = underReviewL2({
  id: 'kontos',
  capability: 'universal',
  addedAt: UnixTime(1730718191),
  display: {
    name: 'Kontos',
    slug: 'kontos',
    description:
      'Kontos is a zero-knowledge based layer-2 account protocol. Its architecture enables users to enjoy numerous multichain features, including gasless transactions and other smart account features.',
    purposes: ['Universal'],
    links: {
      websites: ['https://kontos.io/'],
      bridges: ['https://wallet.kontos.io/'],
      documentation: ['https://docs.kontos.io/'],
      explorers: ['https://explorer.kontos.io/'],
      repositories: ['https://twitter.com/kontosio'],
      socialMedia: [
        'https://discord.com/invite/zecrey',
        'https://x.com/kontosio',
        'https://t.me/ZecreyAnnouncement',
        'https://kontosio.medium.com/',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Validity',
  },
  escrows: [
    {
      address: EthereumAddress('0xc08a7164F9E9d8aB66CcB67D49d6FB116b5808dD'),
      sinceTimestamp: UnixTime(1699939643),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
