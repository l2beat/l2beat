import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const adi: ScalingProject = upcomingL2({
  id: 'adi',
  capability: 'universal',
  addedAt: UnixTime(1759216045), // 2025-09-30
  hasTestnet: true,
  display: {
    name: 'ADI Chain',
    slug: 'adi',
    description:
      'ADI Chain is a zk rollup built for scale and policy alignment.',
    purposes: ['Universal'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://adi.foundation/'],
      explorers: ['https://explorer.testnet.adifoundation.ai/'],
      repositories: ['https://github.com/orgs/ADI-Foundation-Labs/'],
      bridges: ['https://bridge.testnet.adifoundation.ai/'],
      documentation: [
        'https://adi-foundation.gitbook.io/adi-chain-documentation',
      ],
      socialMedia: [
        'https://x.com/ADIChain_',
        'https://discord.com/invite/adi-foundation',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
