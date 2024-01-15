import { Bridge, Layer2, Layer3, Milestone } from '@l2beat/config'

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
    activity: boolean
    liveness: boolean
    finality: boolean
    banner: boolean
    tvlBreakdown: boolean
    gitcoinOption: boolean
    hiringBadge: boolean
    buildAllProjectPages: boolean
  }
  backend: {
    apiUrl: string
    mock?: boolean
    skipCache: boolean
  }
  layer2s: Layer2[]
  layer3s: Layer3[]
  bridges: Bridge[]
  milestones: Milestone[]
}
