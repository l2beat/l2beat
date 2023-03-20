import cx from 'classnames'
import React from 'react'

import { RiskSentiments, RiskValue, RiskValues } from '../../utils/risks/types'
import { MediumRosette } from './Rosette'

export interface RosetteTooltipProps {
  riskSentiments: RiskSentiments
  riskValues: RiskValues
}

export function RosetteTooltipPopup({
  riskValues,
  riskSentiments,
}: RosetteTooltipProps) {
  return (
    <div className="flex w-[370px] flex-col">
      <span className="text-base font-bold">
        <span className="mr-2">Risk analysis</span>
      </span>
      <div className="flex items-center gap-6">
        <div className="">
          <MediumRosette risks={riskSentiments} />
        </div>
        <div className="flex flex-col gap-4">
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
    risk.sentiment === 'bad'
      ? 'text-orange-600 dark:text-red-300'
      : risk.sentiment === 'warning'
      ? 'text-yellow-200'
      : undefined
  return (
    <div className="font-medium">
      <span className="mb-1 block text-[10px] uppercase">{title}</span>
      <span className={cx(sentimentColor, 'text-base')}>{risk.value}</span>
    </div>
  )
}
