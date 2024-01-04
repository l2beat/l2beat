import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'

import { RiskValues } from '../../utils/risks/types'
import { getRiskSentiments } from '../../utils/risks/values'
import { RosetteTooltipPopup, SmallRosette } from '../rosette'
import { Tooltip } from '../tooltip/Tooltip'

export interface RosetteCellProps {
  riskValues: RiskValues
  isUpcoming?: boolean
}

export function RosetteCell({ riskValues, isUpcoming }: RosetteCellProps) {
  const riskSentiments = getRiskSentiments(riskValues)
  return (
    <Tooltip
      content={renderToStaticMarkup(
        <RosetteTooltipPopup
          riskSentiments={riskSentiments}
          riskValues={riskValues}
        />,
      )}
      big
    >
      <SmallRosette
        risks={riskSentiments}
        className="h-6 w-6 md:h-8 md:w-8"
        isUpcoming={isUpcoming}
      />
    </Tooltip>
  )
}
