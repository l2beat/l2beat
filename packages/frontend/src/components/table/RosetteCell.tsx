import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import {
  RiskSentiments,
  RiskValues,
  RosetteTooltipPopup,
  SmallRosette,
} from '../rosette'

export interface RosetteCellProps {
  riskValues: RiskValues
}

export function RosetteCell({ riskValues }: RosetteCellProps) {
  const riskSummary = riskValuesToSummary(riskValues)
  return (
    <span
      className="Tooltip"
      title={renderToStaticMarkup(
        <RosetteTooltipPopup
          riskSummary={riskSummary}
          riskValues={riskValues}
        />,
      )}
    >
      <SmallRosette risks={riskSummary} />
    </span>
  )
}

function riskValuesToSummary(riskValues: RiskValues): RiskSentiments {
  return {
    stateValidation: riskValues.stateValidation.sentiment,
    dataAvailability: riskValues.dataAvailability.sentiment,
    upgradeability: riskValues.upgradeability.sentiment,
    sequencerFailure: riskValues.sequencerFailure.sentiment,
    validatorFailure: riskValues.validatorFailure.sentiment,
  }
}
