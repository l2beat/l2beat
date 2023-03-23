import { bridges, layer2s, milestonesLayer2s, tokenList } from '@l2beat/config'

import { Config } from './Config'

export const common: Omit<Config, 'backend'> = {
  links: {
    twitter: 'https://twitter.com/l2beat',
    discord: 'https://discord.gg/eaVKXPmtWk',
    github: 'https://github.com/l2beat/l2beat',
    linkedin: 'https://www.linkedin.com/company/l2beat/',
    youTube: 'https://www.youtube.com/channel/UCDrl-fNXFjOoykr4lQij9BA/videos',
    medium: 'https://medium.com/l2beat',
    forum: 'https://gov.l2beat.com/',
  },
  features: {
    banner: true,
    gitcoinOption: false,
    hiring: true,
    activity: true,
    milestones: true,
    maturity: false,
    buildAllProjectPages: false,
    upcomingRollups: false,
  },
  layer2s,
  bridges,
  tokens: tokenList,
  milestones: milestonesLayer2s,
}
