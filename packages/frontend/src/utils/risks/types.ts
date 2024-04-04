import { Sentiment, WarningValueWithSentiment } from '@l2beat/shared-pure'

type Risk =
  | 'sequencerFailure'
  | 'stateValidation'
  | 'dataAvailability'
  | 'exitWindow'
  | 'proposerFailure'
export type RiskSentiments = Record<Risk, Sentiment>

export interface RiskValue {
  value: string
  sentiment: Sentiment
  // TODO: make required
  description?: string
  warning?: WarningValueWithSentiment
}

export type RiskValues = Record<Risk, RiskValue>
