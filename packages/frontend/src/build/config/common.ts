import { bridges, layer2s, layer3s, milestonesLayer2s } from '@l2beat/config'

import { Config } from './Config'

const GITCOIN_19_END = new Date('2023-11-29T23:59:59Z')

export const common: Omit<Config, 'backend'> = {
  links: {
    twitter: 'https://twitter.com/l2beat',
    discord: 'https://discord.gg/eaVKXPmtWk',
    github: 'https://github.com/l2beat/l2beat',
    linkedin: 'https://www.linkedin.com/company/l2beat/',
    youTube: 'https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos',
    medium: 'https://medium.com/l2beat',
    forum: 'https://gov.l2beat.com/',
    multisigReport:
      'https://drive.google.com/file/d/182ycEW8C2wk5tGd3X1tG8oQfUy9WmSJk/view',
  },
  features: {
    banner: new Date() <= GITCOIN_19_END,
    gitcoinOption: false,
    liveness: true,
    hiringBadge: false,
    activity: true,
    tvlBreakdown: true,
    buildAllProjectPages: false,
  },
  layer2s,
  layer3s,
  bridges,
  milestones: milestonesLayer2s,
}
