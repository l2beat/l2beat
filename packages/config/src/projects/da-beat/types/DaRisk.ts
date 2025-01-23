import type { Sentiment } from '@l2beat/shared-pure'

export interface DaRisk {
  type: string
  value: string
  sentiment: Sentiment
  description: string
  secondLine?: string
}
