import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const xpla: ScalingProject = upcomingL2({
  id: 'xpla',
  capability: 'universal',
  addedAt: UnixTime(1716818766), // 2024-05-27T14:06:06Z
  display: {
    name: 'zkXPLA',
    slug: 'xpla',
    description:
      "XPLA is a global content powerhouse acting as the hub for digital media. The zkXPLA chain, built on ZKsync's ZK Stack technology, will optimize the deployment of games by publishers and developers and offer a seamless end-to-end gaming environment.",
    purposes: ['Universal', 'Gaming'],
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://xpla.io'],
      bridges: ['https://vault.xpla.io/'],
      documentation: ['https://docs.xpla.io'],
      explorers: ['https://explorer.xpla.io'],
      repositories: ['https://github.com/xpladev'],
      socialMedia: ['https://x.com/XPLA_Official'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
