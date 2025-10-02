import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const moonveil: ScalingProject = upcomingL2({
  id: 'moonveil',
  capability: 'universal',
  addedAt: UnixTime(1721918879), // 2024-07-25T14:47:59Z
  display: {
    name: 'Moonveil',
    slug: 'moonveil',
    description: 'Moonveil is a gaming chain utilizing Polygon CDK technology.',
    purposes: ['Gaming'],
    stacks: ['Agglayer CDK'],
    links: {
      websites: ['https://moonveil.gg/'],
      bridges: ['https://moonveil.gg/AstrArk/'],
      documentation: ['https://moonveil.gitbook.io/whitepaper'],
      explorers: ['https://blockscout.testnet.moonveil.gg'],
      repositories: ['https://github.com/SwellNetwork'],
      socialMedia: [
        'https://x.com/Moonveil_Studio',
        'https://discord.gg/moonveil',
        'https://t.me/+AeiqS8o2YmswYTgx',
        'https://youtube.com/channel/UCFtFhgsjtdSgXarKvSYpz3A',
        'https://medium.com/@Moonveil_Studio',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('agglayer'),
  },
  proofSystem: {
    type: 'Validity',
  },
})
