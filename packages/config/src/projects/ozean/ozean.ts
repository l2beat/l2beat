import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const ozean: ScalingProject = upcomingL2({
  id: 'ozean',
  capability: 'universal',
  addedAt: UnixTime(1739946099),
  hasTestnet: true,
  display: {
    name: 'Ozean',
    slug: 'ozean',
    description:
      "Ozean is Clearpool's new Layer 2 blockchain focused on integrating RWAs into DeFi. Built on the OP Stack.",
    purposes: ['Universal'],
    stacks: ['OP Stack'],
    links: {
      websites: ['https://ozean.finance/'],
      documentation: ['https://docs.ozean.finance/'],
      bridges: ['https://poseidon-testnet.bridge.caldera.xyz/'],
      explorers: ['https://poseidon-testnet.explorer.caldera.xyz/'],
      repositories: ['https://github.com/clearpool-finance'],
      socialMedia: [
        'https://twitter.com/ClearpoolFin',
        'https://t.me/clearpoolofficial',
        'https://clearpool.medium.com/',
        'https://discord.com/invite/YYzxscA4nu',
      ],
    },
  },
  proofSystem: {
    type: 'Optimistic',
  },
  ecosystemInfo: {
    id: ProjectId('superchain'),
  },
})
