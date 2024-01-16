import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { getRiskSentiments } from '../../utils/risks/values'
import { RosetteTooltipPopup, SmallRosette } from '../rosette'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface RosetteCellProps {
  riskValues: RiskValues
  isUpcoming?: boolean
}

export function RosetteCell({ riskValues, isUpcoming }: RosetteCellProps) {
  const riskSentiments = getRiskSentiments(riskValues)
  return (
    <Tooltip big>
      <TooltipTrigger>
        <SmallRosette
          risks={riskSentiments}
          className="h-6 w-6 md:h-8 md:w-8"
          isUpcoming={isUpcoming}
        />
      </TooltipTrigger>
      <TooltipContent>
        <RosetteTooltipPopup
          riskSentiments={riskSentiments}
          riskValues={riskValues}
        />
      </TooltipContent>
    </Tooltip>
  )
}
