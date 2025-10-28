import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const jovay: ScalingProject = underReviewL2({
  id: 'jovay',
  capability: 'universal',
  addedAt: UnixTime(1754392609),
  hasTestnet: true,
  display: {
    name: 'Jovay',
    slug: 'jovay',
    description:
      'Jovay, by Ant Digital Technologies, is an Ethereum Layer 2 blockchain built for real-world assets and users.',
    purposes: ['Universal', 'RWA'],
    links: {
      websites: ['https://jovay.io/'],
      documentation: ['https://docs.jovay.io/'],
      explorers: ['https://explorer.jovay.io/l2'],
      socialMedia: [
        'https://x.com/JovayNetwork',
        'https://discord.com/invite/8pYGeFAs44',
        'https://t.me/Jovay_Network',
      ],
      bridges: ['https://bridge.jovay.io/'],
      repositories: ['https://github.com/jovaynetwork'],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Validity',
  },
  chainConfig: {
    name: 'jovay',
    chainId: 5734951,
    apis: [
      {
        type: 'rpc',
        url: 'https://rpc.jovay.io',
        callsPerMinute: 300,
      },
    ],
  },
  activityConfig: {
    type: 'block',
    startBlock: 1,
  },
  escrows: [
    {
      address: EthereumAddress('0x922248db4a99bb542539ae7165fb9d7a546fb9f1'),
      sinceTimestamp: UnixTime(1754392609),
      tokens: ['ETH'],
      chain: 'ethereum',
    },
  ],
})
