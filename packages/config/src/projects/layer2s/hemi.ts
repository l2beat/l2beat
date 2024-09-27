import { upcomingL2 } from './templates/upcoming'
import { Layer2 } from './types'

export const hemi: Layer2 = upcomingL2({
  id: 'hemi',
  display: {
    name: 'Hemi',
    slug: 'hemi',
    description:
      'Hemi is an OP Stack based L2 powered by Bitcoin and Ethereum.',
    purposes: ['Universal'],
    category: 'Optimistic Rollup',
    provider: 'OP Stack',
    links: {
      websites: ['https://hemi.xyz'],
      apps: ['https://app.hemi.xyz'],
      documentation: ['https://docs.hemi.xyz'],
      explorers: ['https://testnet.explorer.hemi.xyz/'],
      repositories: ['https://github.com/hemilabs'],
      socialMedia: [
        'https://twitter.com/hemi_xyz',
        'https://discord.gg/hemixyz',
        'https://linkedin.com/company/hemi-labs',
        'https://youtube.com/@HemiLabs',
      ],
    },
  },
})
