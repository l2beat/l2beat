import { bridges, layer2s, layer3s, milestonesLayer2s } from '@l2beat/config'

import { Config } from './Config'

const GITCOIN_20_END = new Date('2024-05-07T23:59:59Z')

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
      'https://drive.google.com/file/d/1w__7gL91tDg81Nyq9NohC1R6MVMSEzpD/view',
  },
  features: {
    banner: new Date() < GITCOIN_20_END,
    gitcoinOption: false,
    liveness: true,
    finality: true,
    hiringBadge: false,
    activity: true,
    tvlBreakdown: true,
    implementationChange: true,
    buildAllProjectPages: false,
    costsPage: true,
    tvl: true,
    layer3sTvl: true,
    badges: true,
  },
  layer2s,
  layer3s,
  bridges,
  milestones: milestonesLayer2s,
}
