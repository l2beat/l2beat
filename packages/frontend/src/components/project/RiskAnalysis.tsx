import cx from 'classnames'
import React from 'react'

import { sentimentToTextColor } from '../../utils/risks/color'
import { RiskValues } from '../../utils/risks/types'
import { Section } from './Section'

export interface RiskAnalysisProps {
  riskValues: RiskValues
}

export function RiskAnalysis({
  riskValues: {
    stateValidation,
    sequencerFailure,
    upgradeability,
    dataAvailability,
    validatorFailure,
  },
}: RiskAnalysisProps) {
  return (
    <Section title="Risk analysis" id="risks" className="mt-4">
      <div>
        <h3 className="mt-6 text-lg font-bold uppercase">State validation</h3>
        <span
          className={cx(
            sentimentToTextColor(stateValidation.sentiment),
            'mt-2 block text-2xl font-bold',
          )}
        >
          {stateValidation.value}
        </span>
        <p className="mt-2">{stateValidation.description}</p>
      </div>
      <div>
        <h3 className="mt-6 text-lg font-bold uppercase">Data availability</h3>
        <span
          className={cx(
            sentimentToTextColor(dataAvailability.sentiment),
            'mt-2 block text-2xl font-bold',
          )}
        >
          {dataAvailability.value}
        </span>
        <p className="mt-2">{dataAvailability.description}</p>
      </div>
      <div>
        <h3 className="mt-6 text-lg font-bold uppercase">Upgradeability</h3>
        <span
          className={cx(
            sentimentToTextColor(upgradeability.sentiment),
            'mt-2 block text-2xl font-bold',
          )}
        >
          {upgradeability.value}
        </span>
        <p className="mt-2">{upgradeability.description}</p>
      </div>
      <div>
        <h3 className="mt-6 text-lg font-bold uppercase">Sequencer failure</h3>
        <span
          className={cx(
            sentimentToTextColor(sequencerFailure.sentiment),
            'mt-2 block text-2xl font-bold',
          )}
        >
          {sequencerFailure.value}
        </span>
        <p className="mt-2">{sequencerFailure.description}</p>
      </div>
      <div>
        <h3 className="mt-6 text-lg font-bold uppercase">Validator failure</h3>
        <span
          className={cx(
            sentimentToTextColor(validatorFailure.sentiment),
            'mt-2 block text-2xl font-bold',
          )}
        >
          {validatorFailure.value}
        </span>
        <p className="mt-2">{validatorFailure.description}</p>
      </div>
    </Section>
  )
}
