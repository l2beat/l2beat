import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const nodle: ScalingProject = upcomingL2({
  id: 'nodle',
  capability: 'universal',
  addedAt: UnixTime(1742210597),
  display: {
    name: 'Nodle',
    slug: 'nodle',
    description:
      'Nodle is a decentralized wireless network for IoT devices built on zkSync.',
    purposes: ['Universal'],
    category: 'ZK Rollup',
    stacks: ['ZK Stack'],
    links: {
      websites: ['https://nodle.com/'],
      documentation: ['https://docs.nodle.com/'],
      explorers: ['https://network.nodle.com/'],
      repositories: ['https://github.com/NodleCode'],
      socialMedia: [
        'https://discord.com/invite/N5nTUt8RWJ',
        'https://telegram.me/nodlecommunity',
        'https://x.com/nodlenetwork',
        'https://linkedin.com/company/nodle',
        'https://youtube.com/c/Nodle',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('the-elastic-network'),
  },
})
