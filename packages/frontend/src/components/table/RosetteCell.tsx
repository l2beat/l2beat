import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RiskValues } from '../../utils/risks/types'
import { getRiskSentiments } from '../../utils/risks/values'
import { RosetteTooltipPopup, SmallRosette } from '../rosette'

export interface RosetteCellProps {
  riskValues: RiskValues
}

export function RosetteCell({ riskValues }: RosetteCellProps) {
  const riskSentiments = getRiskSentiments(riskValues)
  const isUpcoming = Object.values(riskValues).every((value) => {
    return (
      value.value === '' && value.description === 'No information available.'
    )
  })
  return (
    <span
      className="Tooltip"
      title={renderToStaticMarkup(
        <RosetteTooltipPopup
          riskSentiments={riskSentiments}
          riskValues={riskValues}
        />,
      )}
      data-tooltip-big
    >
      <SmallRosette
        risks={riskSentiments}
        className="h-6 w-6 md:h-8 md:w-8"
        isUpcoming={isUpcoming}
      />
    </span>
  )
}
