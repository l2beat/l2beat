import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL3 } from '../../templates/underReview'

export const vemphorizon: ScalingProject = underReviewL3({
  id: 'vemphorizon',
  capability: 'universal',
  addedAt: UnixTime(1755133829),
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'VEMP Horizon',
    slug: 'vemphorizon',
    stacks: ['Arbitrum'],
    description:
      'VEMP Horizon is a specialist blockchain designed by VEMP Studios to empower community-driven game economies, particularly for indie and smaller game developers.',
    purposes: ['Gaming'],
    links: {
      websites: ['https://vemp.xyz/'],
      documentation: ['https://docs.vemp.xyz/'],
      explorers: ['https://vemp-horizon.calderaexplorer.xyz/'],
      bridges: ['https://vemp-horizon.bridge.caldera.xyz/'],
      socialMedia: [
        'https://discord.com/invite/vemp',
        'https://x.com/VEMPHorizon/',
        'https://t.me/VEMPCommunityHub',
      ],
      repositories: ['https://github.com/v-Empire'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
  proofSystem: {
    type: 'Optimistic',
  },
  dataAvailability: undefined,
})
