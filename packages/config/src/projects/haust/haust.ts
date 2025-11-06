import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const haust: ScalingProject = underReviewL2({
  id: 'haust',
  capability: 'universal',
  addedAt: UnixTime(1736600180), // 2024-11-12T10:56:20Z
  display: {
    name: 'Haust Network',
    slug: 'haust',
    description:
      'Haust Network is a zkEVM Layer 2 blockchain built on the Polygon CDK, integrating with the Agglayer and Account Abstraction from the outset.',
    purposes: ['Exchange'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://haust.network/'],
      documentation: ['https://docs.haust.network/'],
      explorers: ['https://haustscan.com/'],
      repositories: ['https://github.com/Haust-Labs'],
      bridges: ['https://haustbridge.com'],
      socialMedia: [
        'https://twitter.com/HaustNetwork',
        'https://t.me/haustnetwork',
        'https://discord.gg/QWGxjTXD8N',
        'https://medium.com/@haustnetwork',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
  dataAvailability: undefined,
})
