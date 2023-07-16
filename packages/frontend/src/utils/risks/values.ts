import { Layer2RiskView } from '@l2beat/config'

import { RiskSentiments, RiskValues } from './types'

export function getRiskValues(riskView: Layer2RiskView): RiskValues {
  return {
    dataAvailability: riskView.dataAvailability,
    sequencerFailure: riskView.sequencerFailure,
    stateValidation: riskView.stateValidation,
    upgradeability: riskView.upgradeability,
    proposerFailure: riskView.proposerFailure,
  }
}

export function getRiskSentiments(
  riskView: Layer2RiskView | RiskValues,
  isUnderReview?: boolean,
): RiskSentiments {
  if (isUnderReview) {
    return {
      sequencerFailure: 'UnderReview',
      stateValidation: 'UnderReview',
      dataAvailability: 'UnderReview',
      upgradeability: 'UnderReview',
      proposerFailure: 'UnderReview',
    }
  }
  return {
    sequencerFailure: riskView.sequencerFailure.sentiment,
    stateValidation: riskView.stateValidation.sentiment,
    dataAvailability: riskView.dataAvailability.sentiment,
    upgradeability: riskView.upgradeability.sentiment,
    proposerFailure: riskView.proposerFailure.sentiment,
  }
}
