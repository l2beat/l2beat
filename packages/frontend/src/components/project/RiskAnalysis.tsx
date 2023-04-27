import cx from 'classnames'
import React from 'react'

import { sentimentToTextColor } from '../../utils/risks/color'
import { RiskValues } from '../../utils/risks/types'
import { BigRosette } from '../rosette'
import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface RiskAnalysisProps {
  id: string
  title: string
  riskValues: RiskValues
}

export function RiskAnalysis({ id, title, riskValues }: RiskAnalysisProps) {
  return (
    <ProjectDetailsSection title={title} id={id} className="mt-4">
      <BigRosette risks={riskValues} className="mx-auto my-6 lg:hidden" />
      <div>
        <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
          State validation
        </h3>
        <span
          className={cx(
            sentimentToTextColor(riskValues.stateValidation.sentiment),
            'mt-2 block text-xl font-bold md:text-2xl',
          )}
        >
          {riskValues.stateValidation.value}
        </span>
        <p className="mt-2 text-gray-850 dark:text-gray-400">
          {riskValues.stateValidation.description}
        </p>
      </div>
      <div>
        <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
          Data availability
        </h3>
        <span
          className={cx(
            sentimentToTextColor(riskValues.dataAvailability.sentiment),
            'mt-2 block text-xl font-bold md:text-2xl',
          )}
        >
          {riskValues.dataAvailability.value}
        </span>
        <p className="mt-2 text-gray-850 dark:text-gray-400">
          {riskValues.dataAvailability.description}
        </p>
      </div>
      <div>
        <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
          Upgradeability
        </h3>
        <span
          className={cx(
            sentimentToTextColor(riskValues.upgradeability.sentiment),
            'mt-2 block text-xl font-bold md:text-2xl',
          )}
        >
          {riskValues.upgradeability.value}
        </span>
        <p className="mt-2 text-gray-850 dark:text-gray-400">
          {riskValues.upgradeability.description}
        </p>
      </div>
      <div>
        <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
          Sequencer failure
        </h3>
        <span
          className={cx(
            sentimentToTextColor(riskValues.sequencerFailure.sentiment),
            'mt-2 block text-xl font-bold md:text-2xl',
          )}
        >
          {riskValues.sequencerFailure.value}
        </span>
        <p className="mt-2 text-gray-850 dark:text-gray-400">
          {riskValues.sequencerFailure.description}
        </p>
      </div>
      <div>
        <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
          Validator failure
        </h3>
        <span
          className={cx(
            sentimentToTextColor(riskValues.validatorFailure.sentiment),
            'mt-2 block text-xl font-bold md:text-2xl',
          )}
        >
          {riskValues.validatorFailure.value}
        </span>
        <p className="mt-2 text-gray-850 dark:text-gray-400">
          {riskValues.validatorFailure.description}
        </p>
      </div>
    </ProjectDetailsSection>
  )
}
