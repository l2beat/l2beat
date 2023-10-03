import cx from 'classnames'
import React from 'react'

import { sentimentToTextColor } from '../../utils/risks/color'
import { RiskValue, RiskValues } from '../../utils/risks/types'
import { UnderReviewBadge } from '../badge/UnderReviewBadge'
import { Markdown } from '../Markdown'
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
  return (
    <div>
      <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">{name}</h3>
      {riskValue.sentiment === 'UnderReview' ? (
        <span className="mt-2 block">
          {name} risk is currently <UnderReviewBadge />
        </span>
      ) : (
        <>
          <span
            className={cx(
              sentimentToTextColor(riskValue.sentiment),
              'mt-2 block text-xl font-bold md:text-2xl',
            )}
          >
            {riskValue.value}
          </span>
          {riskValue.description && (
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {riskValue.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
