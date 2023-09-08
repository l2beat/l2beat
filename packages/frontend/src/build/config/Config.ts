import { Bridge, Layer2, Milestone } from '@l2beat/config'

export interface Config {
  links: {
    twitter: string
    discord: string
    github: string
    linkedin: string
    youTube: string
    medium: string
    forum: string
    multisigReport: string
  }
  features: {
    detailedTvl: boolean
    activity: boolean
    banner: boolean
    gitcoinOption: boolean
    milestones: boolean
    hiring: boolean
    hiringBadge: boolean
    stages: boolean
    buildAllProjectPages: boolean
    upcomingRollups: boolean
    multisigReport: boolean
  }
  backend: {
    apiUrl: string
    mock?: boolean
    skipCache: boolean
  }
  layer2s: Layer2[]
  bridges: Bridge[]
  milestones: Milestone[]
}
