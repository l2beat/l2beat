import React from 'react'

import { RiskValues } from '../../utils/risks/types'
import { getRiskSentiments } from '../../utils/risks/values'
import { RosetteTooltipPopup, SmallRosette } from '../rosette'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/Tooltip'

export interface RosetteCellProps {
  riskValues: RiskValues
  isUpcoming?: boolean
  isUnderReview?: boolean
}

export function RosetteCell({
  riskValues,
  isUpcoming,
  isUnderReview,
}: RosetteCellProps) {
  isUnderReview =
    isUnderReview ??
    Object.values(riskValues).every(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  const riskSentiments = getRiskSentiments(riskValues, isUnderReview)

  return (
    <Tooltip big>
      <TooltipTrigger>
        <SmallRosette
          risks={riskSentiments}
          className="size-6 md:size-8"
          isUpcoming={isUpcoming}
          isUnderReview={isUnderReview}
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
