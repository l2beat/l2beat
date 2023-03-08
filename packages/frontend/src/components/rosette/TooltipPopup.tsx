import cx from 'classnames'
import React from 'react'

import { BigRosette } from './Rosette'
import { RiskSentiments, RiskValue, RiskValues } from './types'

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
      <span className="text-base font-bold">
        <span className="mr-2">Risk analysis</span>
      </span>
      <div className="flex gap-4">
        <div className="-ml-3">
          <BigRosette risks={riskSummary} />
        </div>
        <div>
          <RiskValueComponent
            title="Sequencer failure"
            risk={riskValues.sequencerFailure}
          />
          <RiskValueComponent
            title="State validation"
            risk={riskValues.stateValidation}
          />
          <RiskValueComponent
            title="Data availability"
            risk={riskValues.dataAvailability}
          />
          <RiskValueComponent
            title="Upgradeability"
            risk={riskValues.upgradeability}
          />
          <RiskValueComponent
            title="Validator failure"
            risk={riskValues.validatorFailure}
          />
        </div>
      </div>
    </div>
  )
}

interface RiskValueProps {
  title: string
  risk: RiskValue
}

function RiskValueComponent({ title, risk }: RiskValueProps) {
  const sentimentColor =
    risk.sentiment &&
    (risk.sentiment === 'bad' ? 'text-red-500' : 'text-yellow-200')
  return (
    <div>
      <span className="mb-1 block text-[10px] uppercase">{title}</span>
      <span className={cx(sentimentColor, 'mb-4 block text-base font-medium')}>
        {risk.value}
      </span>
    </div>
  )
}
