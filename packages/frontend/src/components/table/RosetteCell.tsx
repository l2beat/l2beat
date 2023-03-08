import { Layer2RiskView } from '@l2beat/config'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RiskSentiments, RosetteTooltipPopup, SmallRosette } from '../rosette'

export interface RosetteCellProps {
  riskView: Layer2RiskView
}

export function RosetteCell({ riskView }: RosetteCellProps) {
  const riskSummary = riskViewToSummary(riskView)
  return (
    <span
      className="Tooltip"
      title={renderToStaticMarkup(
        <RosetteTooltipPopup riskSummary={riskSummary} riskValues={riskView} />,
      )}
    >
      <SmallRosette risks={riskSummary} />
    </span>
  )
}

function riskViewToSummary(riskView: Layer2RiskView): RiskSentiments {
  return {
    stateValidation: riskView.stateValidation.sentiment,
    dataAvailability: riskView.dataAvailability.sentiment,
    upgradeability: riskView.upgradeability.sentiment,
    sequencerFailure: riskView.sequencerFailure.sentiment,
    validatorFailure: riskView.validatorFailure.sentiment,
  }
}
