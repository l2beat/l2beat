import React from 'react'

import { Markdown } from '../../../../components/Markdown'
import { WarningBar } from '../../../../components/WarningBar'
import { UnderReviewBadge } from '../../../../components/badge/UnderReviewBadge'
import { RoundedWarningIcon, ShieldIcon } from '../../../../components/icons'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { BigRosette } from '../../../../components/rosette'
import { SentimentText } from '../../../../components/table/SentimentText'
import { RiskValue, RiskValues } from '../../../../utils/risks/types'
import { ProjectSection } from './common/ProjectSection'
import { ProjectSectionId } from './common/sectionId'

export interface RiskAnalysisSectionProps {
  id: ProjectSectionId
  title: string
  sectionOrder: number
  riskValues: RiskValues
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
  isUnderReview?: boolean
}

export function RiskAnalysisSection({
  id,
  title,
  sectionOrder,
  riskValues,
  isVerified,
  warning,
  redWarning,
  isUnderReview,
}: RiskAnalysisSectionProps) {
  isUnderReview =
    isUnderReview ??
    Object.values(riskValues).every(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection
      title={title}
      id={id}
      sectionOrder={sectionOrder}
      isUnderReview={isUnderReview}
    >
      {isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
          icon={UnverifiedIcon}
        />
      )}
      {redWarning && (
        <WarningBar
          text={redWarning}
          color="red"
          className="mt-4"
          icon={ShieldIcon}
        />
      )}
      {warning && (
        <WarningBar
          text={warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}
      <BigRosette risks={riskValues} className="mx-auto my-6 lg:hidden" />
      <SingleRisk
        name="State validation"
        riskValue={riskValues.stateValidation}
      />
      <SingleRisk
        name="Data availability"
        riskValue={riskValues.dataAvailability}
      />
      <SingleRisk name="Exit window" riskValue={riskValues.exitWindow} />
      <SingleRisk
        name="Sequencer failure"
        riskValue={riskValues.sequencerFailure}
      />
      <SingleRisk
        name="Proposer failure"
        riskValue={riskValues.proposerFailure}
      />
    </ProjectSection>
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
      <h3 className="mt-6 font-bold text-sm uppercase md:text-lg">{name}</h3>
      {riskValue.sentiment === 'UnderReview' ? (
        <span className="mt-2 block">
          {name} risk is currently <UnderReviewBadge />
        </span>
      ) : (
        <>
          <SentimentText
            sentiment={riskValue.sentiment}
            className="mt-2 block font-bold text-xl md:text-2xl"
          >
            {riskValue.value}
          </SentimentText>
          {riskValue.warning && (
            <WarningBar
              className="my-2"
              icon={RoundedWarningIcon}
              text={riskValue.warning.value}
              color={riskValue.warning.sentiment === 'bad' ? 'red' : 'yellow'}
            />
          )}
          {riskValue.description && (
            <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400">
              {riskValue.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
