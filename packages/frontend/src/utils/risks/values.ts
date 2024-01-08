import { ProjectRiskView } from '@l2beat/config'

import { RiskSentiments, RiskValues } from './types'

export function getRiskValues(riskView: ProjectRiskView): RiskValues {
  return {
    dataAvailability: riskView.dataAvailability,
    sequencerFailure: riskView.sequencerFailure,
    stateValidation: riskView.stateValidation,
    exitWindow: riskView.exitWindow,
    proposerFailure: riskView.proposerFailure,
  }
}

export function getRiskSentiments(
  riskView: ProjectRiskView | RiskValues,
  isUnderReview?: boolean,
): RiskSentiments {
  if (isUnderReview) {
    return {
      sequencerFailure: 'UnderReview',
      stateValidation: 'UnderReview',
      dataAvailability: 'UnderReview',
      exitWindow: 'UnderReview',
      proposerFailure: 'UnderReview',
    }
  }
  return {
    sequencerFailure: riskView.sequencerFailure.sentiment,
    stateValidation: riskView.stateValidation.sentiment,
    dataAvailability: riskView.dataAvailability.sentiment,
    exitWindow: riskView.exitWindow.sentiment,
    proposerFailure: riskView.proposerFailure.sentiment,
  }
}
