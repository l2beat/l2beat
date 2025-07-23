import { UnixTime } from '@l2beat/shared-pure'
import type { ScalingProject } from '../../internalTypes'
import { upcomingL2 } from '../../templates/upcoming'

export const layerai: ScalingProject = upcomingL2({
  id: 'layerai',
  capability: 'universal',
  addedAt: UnixTime(1722861199), // 2024-08-05T12:33:19Z
  display: {
    name: 'LayerAI',
    slug: 'layerai',
    description:
      'LayerAI is the dedicated blockchain network for data monetization within AI models. It functions as a sophisticated ecosystem strategically crafted to expedite the rise of the data economy. The LayerAI ecosystem empowers individuals to step into a transformative epoch where they can own, control, and capitalize on their most substantial digital asset – Data.',
    purposes: ['AI'],
    category: 'ZK Rollup',
    links: {
      websites: ['https://layerai.org/'],
      bridges: ['https://kyotox.com/', 'https://layervpn.com/'],
      documentation: ['https://docs.layerai.org/'],
      socialMedia: ['https://t.me/LayerAI_org', 'https://x.com/LayerAIorg'],
    },
  },
})
