import React from 'react'
import { RoundedWarningIcon } from '~/icons/rounded-warning'
import ShieldIcon from '~/icons/shield.svg'
import UnverifiedIcon from '~/icons/unverified.svg'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { Markdown } from '../../markdown/markdown'
import { BigPentagonRosette } from '../../rosette/pentagon/big-pentagon-rosette'
import { type RosetteValue } from '../../rosette/types'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface RiskAnalysisSectionProps extends ProjectSectionProps {
  riskValues: RosetteValue[]
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
  isUnderReview?: boolean
}

export function RiskAnalysisSection(props: RiskAnalysisSectionProps) {
  const isUnderReview =
    !!props.isUnderReview ||
    Object.values(props.riskValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
      isUnderReview={isUnderReview}
    >
      {props.isVerified === false && (
        <WarningBar
          text="This project includes unverified contracts."
          color="red"
          isCritical={true}
          className="mt-4"
          icon={UnverifiedIcon}
        />
      )}
      {props.redWarning && (
        <WarningBar
          text={props.redWarning}
          color="red"
          className="mt-4"
          icon={ShieldIcon}
        />
      )}
      {props.warning && (
        <WarningBar
          text={props.warning}
          color="yellow"
          isCritical={false}
          className="mt-4"
        />
      )}
      <BigPentagonRosette
        values={props.riskValues}
        className="mx-auto my-6 lg:hidden"
      />
      {Object.values(props.riskValues).map((value) => (
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
      <h3 className="mt-6 text-sm font-bold uppercase md:text-lg">
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
            className="mt-2 block text-xl font-bold md:text-2xl"
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
            <Markdown className="mt-2 leading-snug text-gray-850 dark:text-gray-400">
              {value.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
