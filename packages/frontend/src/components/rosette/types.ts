import type { Sentiment, WarningValueWithSentiment } from '@l2beat/config'

export interface RosetteValue {
  name: string
  value: string
  sentiment: Sentiment
  description: string | undefined
  warning: WarningValueWithSentiment | undefined
}
