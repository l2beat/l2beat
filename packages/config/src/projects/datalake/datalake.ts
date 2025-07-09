import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL3 } from '../../templates/upcoming'

export const datalake: ScalingProject = upcomingL3({
  id: 'datalake',
  capability: 'universal',
  addedAt: UnixTime(1738498515), // 2025-02-02T14:15:15Z
  hostChain: ProjectId('arbitrum'),
  display: {
    name: 'DataLake',
    slug: 'datalake',
    description:
      'Data Lake Chain marks the beginning of its mission to build a robust, secure, efficient, and scalable infrastructure to support scientific research.',
    purposes: ['AI'],
    category: 'Optimium',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://data-lake.co'],
      documentation: ['https://docs.data-lake.co/'],
      socialMedia: [
        'https://x.com/DataLakeToken',
        'https://t.me/DataLakeCommunity',
        'https://linkedin.com/company/data-lake-co/',
        'https://datalaketoken.medium.com/',
      ],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
