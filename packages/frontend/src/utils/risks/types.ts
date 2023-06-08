export type Sentiment = 'bad' | 'warning'
type Risk =
  | 'sequencerFailure'
  | 'stateValidation'
  | 'dataAvailability'
  | 'upgradeability'
  | 'proposerFailure'
export type RiskSentiments = Partial<Record<Risk, Sentiment>>

export interface RiskValue {
  value: string
  sentiment?: Sentiment
  // TODO: make required
  description?: string
}

export type RiskValues = Record<Risk, RiskValue>
