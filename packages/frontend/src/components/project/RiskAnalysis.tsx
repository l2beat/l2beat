import cx from 'classnames'
import React from 'react'

import { sentimentToTextColor } from '../../utils/risks/color'
import { RiskValue, RiskValues } from '../../utils/risks/types'
import { BigRosette } from '../rosette'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { SectionId } from './sectionId'

export interface RiskAnalysisProps {
  id: SectionId
  title: string
  riskValues: RiskValues
  isUnderReview?: boolean
}

export function RiskAnalysis({
  id,
  title,
  riskValues,
  isUnderReview,
}: RiskAnalysisProps) {
  isUnderReview =
    isUnderReview ??
    Object.values(riskValues).every(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectDetailsSection
      title={title}
      id={id}
      className="mt-4"
      isUnderReview={isUnderReview}
    >
      <BigRosette risks={riskValues} className="mx-auto my-6 lg:hidden" />
      <SingleRisk
        name="State validation"
        riskValue={riskValues.stateValidation}
      />
      <SingleRisk
        name="Data availability"
        riskValue={riskValues.dataAvailability}
      />
      <SingleRisk name="Upgradeability" riskValue={riskValues.upgradeability} />
      <SingleRisk
        name="Sequencer failure"
        riskValue={riskValues.sequencerFailure}
      />
      <SingleRisk
        name="Proposer failure"
        riskValue={riskValues.proposerFailure}
      />
    </ProjectDetailsSection>
  )
}
function SingleRisk({
  name,
  riskValue,
}: {
  name: string
  riskValue: RiskValue
}) {
  if (riskValue.sentiment === 'UnderReview') {
    return null
  }

  return (
    <div>
      <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">{name}</h3>

      <span
        className={cx(
          sentimentToTextColor(riskValue.sentiment),
          'mt-2 block text-xl font-bold md:text-2xl',
        )}
      >
        {riskValue.value}
      </span>
      <p className="mt-2 text-gray-850 dark:text-gray-400">
        {riskValue.description}
      </p>
    </div>
  )
}
