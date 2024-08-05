import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const layerai: Layer2 = upcomingL2({
  id: 'layerai',
  display: {
    name: 'LayerAI',
    slug: 'layerai',
    description:
      'LayerAI is the dedicated blockchain network for data monetization within AI models. It functions as a sophisticated ecosystem strategically crafted to expedite the rise of the data economy. The LayerAI ecosystem empowers individuals to step into a transformative epoch where they can own, control, and capitalize on their most substantial digital asset – Data.',
    purposes: ['AI'],
    category: 'ZK Rollup',
    provider: 'Polygon',
    links: {
      websites: ['https://layerai.org/'],
      apps: ['https://kyotox.com/', 'https://ayervpn.com/'],
      documentation: ['https://docs.layerai.org/'],
      explorers: [],
      repositories: [],
      socialMedia: ['https://t.me/LayerAI_org', 'https://x.com/LayerAIorg'],
    },
  },
})
