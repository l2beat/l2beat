import { EthereumAddress, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'
import { ProjectDiscovery } from '../../discovery/ProjectDiscovery'

const discovery = new ProjectDiscovery('megaeth')

export const megaeth: ScalingProject = underReviewL2({
  id: 'megaeth',
  capability: 'universal',
  addedAt: UnixTime(1764143601),
  display: {
    name: 'Megaeth',
    slug: 'megaeth',
    description:
      '',
    purposes: ['Universal', 'Interoperability'],
    links: {
      websites: ['https://megaeth.xyz/'],
      bridges: ['https://app.megaeth.xyz/'],
      documentation: ['https://docs.megaeth.xyz/'],
      explorers: [],
      repositories: ['https://github.com/megaeth-xyz'],
      socialMedia: [
        'https://x.com/megaeth_xyz',
        'https://discord.com/invite/megaeth-xyz',
      ],
    },
  },
  dataAvailability: undefined,
  proofSystem: {
    type: 'Optimistic',
  },
  escrows: [
    {
      address: EthereumAddress('0x79d968d9017B96f202aD4673A2c1BBbdc905A4ca'), // core contract ant multi asset escrow
      sinceTimestamp: UnixTime(1734103235),
      tokens: '*',
      chain: 'ethereum',
    },
  ],
  // no rpc found
})
