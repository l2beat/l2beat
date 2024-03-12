import { ValueWithSentiment, WarningWithSentiment } from '@l2beat/shared-pure'

export interface ScalingProjectRisk {
  /** Category of this risk */
  category: ScalingProjectRiskCategory
  /** Description of the risk. Should form a sentence with the category */
  text: string
  /** If the risk is particularly bad */
  isCritical?: boolean
  /** Ignore tests for formatting */
  _ignoreTextFormatting?: boolean
}

export type ScalingProjectRiskCategory =
  | 'Funds can be stolen if'
  | 'Funds can be lost if'
  | 'Funds can be frozen if'
  | 'Users can be censored if'
  | 'MEV can be extracted if'
  | 'Withdrawals can be delayed if'

export interface ScalingProjectRiskViewEntry
  extends ValueWithSentiment<string> {
  description: string
  warning?: WarningWithSentiment
  // second line in risk view
  secondLine?: string
  secondSentiment?: 'warning' | 'bad'
  sources?: {
    contract: string
    references: string[]
  }[]
  otherReferences?: string[]
}
