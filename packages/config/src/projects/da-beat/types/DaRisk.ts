import type { Sentiment } from '@l2beat/shared-pure'

export interface DaRisk {
  type: string
  value: string
  description: string
  sentiment: Sentiment
}
