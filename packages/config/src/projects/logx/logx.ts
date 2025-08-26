import { ProjectId, UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { underReviewL2 } from '../../templates/underReview'

export const logx: ScalingProject = underReviewL2({
  id: 'logx',
  capability: 'universal',
  addedAt: UnixTime(1753947052),
  display: {
    name: 'LogX',
    slug: 'logx',
    description:
      "LogX is building the world\'s first modular derivatives infrastructure, enabling infinite scalability across all blockchain networks.",
    purposes: ['Exchange'],
    stacks: ['Arbitrum'],
    links: {
      websites: ['https://logx.network/'],
      documentation: ['https://docs.logx.network/logx-network'],
      repositories: ['https://github.com/eugenix-io'],
      socialMedia: [
        'https://x.com/LogX_trade',
        'https://discord.com/invite/tU3WJ9A4b8',
        'https://t.me/logx_announcements',
      ],
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
