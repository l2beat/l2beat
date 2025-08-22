import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const zklighter: ScalingProject = upcomingL2({
  id: 'zklighter',
  capability: 'universal',
  addedAt: UnixTime(1711551933), // 2024-03-27T15:05:33Z
  display: {
    name: 'zkLighter',
    slug: 'zklighter',
    description:
      'zkLighter is an efficient order book Validium on Ethereum - low cost, low latency, verifiable matching.',
    purposes: ['Universal', 'Exchange'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://zk.lighter.xyz'],
      explorers: ['https://scan.lighter.xyz'],
      documentation: ['https://docs.lighter.xyz'],
      repositories: ['https://github.com/elliottech'],
      socialMedia: [
        'https://x.com/Lighter_xyz',
        'https://discord.com/invite/gPHuvUE6VU',
        'https://linkedin.com/company/lighter-xyz',
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
