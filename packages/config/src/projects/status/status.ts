import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const status: ScalingProject = upcomingL2({
  id: 'status',
  capability: 'universal',
  hasTestnet: true,
  addedAt: UnixTime(1729678881), // 2024-10-23T12:21:33
  display: {
    name: 'status',
    slug: 'status',
    description:
      'Status is a free network with sustainable funding for public apps, games and protocols.',
    purposes: ['Social'],
    links: {
      websites: ['https://status.network/'],
      bridges: ['https://bridge.status.network/'],
      documentation: ['https://docs.status.network/'],
      repositories: ['https://github.com/status-im'],
      socialMedia: ['https://x.com/StatusL2'],
      explorers: ['https://sepoliascan.status.network'],
    },
  },
  proofSystem: {
    type: 'Validity',
  },
})
