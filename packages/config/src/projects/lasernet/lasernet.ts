import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const lasernet: ScalingProject = underReviewL2({
  id: 'lasernet',
  capability: 'universal',
  addedAt: UnixTime(1745311928),
  display: {
    name: 'Lasernet by DIA',
    slug: 'lasernet',
    description:
      'Lasernet is a new oracle architecture with an ETH layer-2 at its core. Lasernet brings fully on-chain, verifiable, and trustless data through its permissionless and modular design.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://diadata.org/'],
      apps: ['https://diadata.org/app/'],
      documentation: ['https://docs.diadata.org/resources/chain-information'],
      explorers: ['https://explorer.diadata.org/'],
      repositories: ['https://github.com/diadata-org/'],
      socialMedia: [
        'https://twitter.com/DIAdata_org',
        'https://discord.com/invite/RjHBcZ9mEH',
        'https://t.me/diadata_org',
        'https://linkedin.com/company/diadata-org/',
        'https://diadata.org/blog/',
      ],
    },
  },
  escrows: [
    {
      address: EthereumAddress('0x84cA8bc7997272c7CfB4D0Cd3D55cd942B3c9419'),
      sinceTimestamp: UnixTime(1574851679),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
})
