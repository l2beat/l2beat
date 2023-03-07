import React from 'react'

import { BigRosette } from './Rosette'
import { RiskSentiments, RiskValues } from './types'

export interface RosetteTooltipProps {
  riskSummary: RiskSentiments
  riskValues: RiskValues
}

export function RosetteTooltipPopup({
  riskValues,
  riskSummary,
}: RosetteTooltipProps) {
  return (
    <div className="w-88 flex flex-col gap-4">
      <span className="font-bold">
        <span className="mr-2">Current score</span>
      </span>
      <BigRosette risks={riskSummary} />
    </div>
  )
}
