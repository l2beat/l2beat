export type Sentiment = 'bad' | 'warning'
type Risk =
  | 'sequencerFailure'
  | 'stateValidation'
  | 'dataAvailability'
  | 'upgradeability'
  | 'validatorFailure'
export type RiskSentiments = Partial<Record<Risk, Sentiment>>

export interface RosetteProps {
  risks: RiskSentiments
}

interface RiskValue {
  value: string
  sentiment?: Sentiment
}

export type RiskValues = Record<Risk, RiskValue>
