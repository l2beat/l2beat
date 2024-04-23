import { Bridge, Layer2, Layer3, Milestone } from '@l2beat/config'

export interface Config {
  links: ConfigLinks
  features: ConfigFeatures
  backend: ConfigBackend
  layer2s: Layer2[]
  layer3s: Layer3[]
  bridges: Bridge[]
  milestones: Milestone[]
}
export interface ConfigLinks {
  twitter: string
  discord: string
  github: string
  linkedin: string
  youTube: string
  medium: string
  forum: string
  multisigReport: string
}

export interface ConfigFeatures {
  activity: boolean
  liveness: boolean
  finality: boolean
  banner: boolean
  tvlBreakdown: boolean
  implementationChange: boolean
  gitcoinOption: boolean
  hiringBadge: boolean
  buildAllProjectPages: boolean
  governancePage: boolean
  costsPage: boolean
}

export interface ConfigBackend {
  apiUrl: string
  mock?: boolean
  skipCache: boolean
}
