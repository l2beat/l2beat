import React from 'react'

import { UnderReviewBadge } from '../../../../components/badge/UnderReviewBadge'
import { RoundedWarningIcon, ShieldIcon } from '../../../../components/icons'
import { UnverifiedIcon } from '../../../../components/icons/symbols/UnverifiedIcon'
import { Markdown } from '../../../../components/Markdown'
import { BigRosette } from '../../../../components/rosette'
import { SentimentText } from '../../../../components/table/SentimentText'
import { WarningBar } from '../../../../components/WarningBar'
import { RiskValue, RiskValues } from '../../../../utils/risks/types'
import { Section } from './common/Section'
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
    <Section
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
    </Section>
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
          <SentimentText
            sentiment={riskValue.sentiment}
            className="mt-2 block text-xl font-bold md:text-2xl"
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
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {riskValue.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
