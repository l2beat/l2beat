import React from 'react'
import { type ProjectSectionProps } from './types'
import { type RosetteValue } from '../../rosette/types'
import { ProjectSection } from './project-section'
import { WarningBar } from '../../warning-bar'
import UnverifiedIcon from '~/icons/unverified.svg'
import ShieldIcon from '~/icons/shield.svg'
import { BigPentagonRosette } from '../../rosette/pentagon/big-pentagon-rosette'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { SentimentText } from '../../sentiment-text'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { Markdown } from '../../markdown/markdown'

export interface RiskAnalysisSectionProps extends ProjectSectionProps {
  riskValues: RosetteValue[]
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
      <BigPentagonRosette
        values={riskValues}
        className="mx-auto my-6 lg:hidden"
      />
      {Object.values(riskValues).map((value) => (
        <SingleRisk key={value.name} value={value} />
      ))}
    </ProjectSection>
  )
}

function SingleRisk({
  value,
}: {
  value: RosetteValue
}) {
  return (
    <div>
      <h3 className="mt-6 font-bold text-sm uppercase md:text-lg">
        {value.name}
      </h3>
      {value.sentiment === 'UnderReview' ? (
        <span className="mt-2 block">
          {value.name} risk is currently <UnderReviewBadge />
        </span>
      ) : (
        <>
          <SentimentText
            sentiment={value.sentiment}
            className="mt-2 block font-bold text-xl md:text-2xl"
          >
            {value.value}
          </SentimentText>
          {value.warning && (
            <WarningBar
              className="my-2"
              icon={RoundedWarningIcon}
              text={value.warning.value}
              color={value.warning.sentiment === 'bad' ? 'red' : 'yellow'}
            />
          )}
          {value.description && (
            <Markdown className="mt-2 text-gray-850 leading-snug dark:text-gray-400">
              {value.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
