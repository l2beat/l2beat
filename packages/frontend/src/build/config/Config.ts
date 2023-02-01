import { Bridge, Layer2, Milestone, TokenInfo } from '@l2beat/config'

export interface Config {
  links: {
    twitter: string
    discord: string
    github: string
    youTube: string
    medium: string
    forum: string
  }
  features: {
    bridges: boolean
    activity: boolean
    banner: boolean
    gitcoinOption: boolean
    milestones: boolean
    hiring: boolean
    rating: boolean
  }
  backend: {
    apiUrl: string
    skipCache: boolean
  }
  layer2s: Layer2[]
  bridges: Bridge[]
  milestones: Milestone[]
  tokens: TokenInfo[]
}
