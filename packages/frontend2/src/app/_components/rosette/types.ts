import {
  type Sentiment,
  type WarningValueWithSentiment,
} from '@l2beat/shared-pure'

export interface RosetteValue {
  name: string
  sentiment: Sentiment
  warning?: WarningValueWithSentiment
}
