import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const millicent: ScalingProject = upcomingL2({
  id: 'millicent',
  capability: 'universal',
  addedAt: UnixTime(1720191862), // 2024-07-05T15:04:22Z
  display: {
    name: 'Millicent One',
    slug: 'millicent',
    description:
      'Millicent is an upcoming Layer 2 on Ethereum, built on the Orbit stack. It is focused on tokenized Real World Assets (RWAs) and digital currencies like tokenized bank deposits, stablecoins, and central bank assets.',
    purposes: ['RWA'],
    category: 'Optimistic Rollup',
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://millicent.io/'],
      documentation: ['https://docs.millicent.io'],
      socialMedia: ['https://x.com/MillicentLabs'],
    },
  },
  ecosystemInfo: {
    id: ProjectId('arbitrum-orbit'),
  },
})
