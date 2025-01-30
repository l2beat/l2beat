import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { Markdown } from '../../markdown/markdown'
import { BigPentagonRosette } from '../../rosette/pentagon/big-pentagon-rosette'
import { BigPizzaRosette } from '../../rosette/pizza/big-pizza-rosette'
import type { RosetteValue } from '../../rosette/types'
import { SentimentText } from '../../sentiment-text'
import { WarningBar, sentimentToWarningBarColor } from '../../warning-bar'
import { ProjectSection } from './project-section'
import type { ProjectSectionProps } from './types'

export interface RiskAnalysisSectionProps extends ProjectSectionProps {
  rosetteType: 'pizza' | 'pentagon'
  rosetteValues: RosetteValue[]
  warning: string | undefined
  isVerified: boolean | undefined
  redWarning: string | undefined
  shouldHideRosette?: boolean | undefined
}

export function RiskAnalysisSection({
  rosetteType,
  rosetteValues,
  warning,
  isVerified,
  redWarning,
  shouldHideRosette,
  ...sectionProps
}: RiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values(rosetteValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview}>
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

      {!shouldHideRosette && (
        <>
          {rosetteType === 'pizza' ? (
            <BigPizzaRosette values={rosetteValues} className="mx-auto my-6" />
          ) : (
            <BigPentagonRosette
              values={rosetteValues}
              className="mx-auto my-6"
            />
          )}
        </>
      )}
      {Object.values(rosetteValues).map((value) => (
        <SingleRisk key={value.name} value={value} />
      ))}
    </ProjectSection>
  )
}

export function SingleRisk({
  value,
}: {
  value: RosetteValue
}) {
  return (
    <div>
      <h3 className="mt-6 text-sm font-medium uppercase text-zinc-800 dark:text-white md:text-lg">
        {value.name}
      </h3>
      {value.sentiment === 'UnderReview' ? (
        <span className="block">
          {value.name} risk is currently <UnderReviewBadge />
        </span>
      ) : (
        <>
          <SentimentText
            sentiment={value.sentiment ?? 'neutral'}
            className="block text-xl font-medium md:text-2xl"
            vibrant
          >
            {value.value}
          </SentimentText>
          {value.warning && (
            <WarningBar
              className="my-2"
              icon={RoundedWarningIcon}
              text={value.warning.value}
              color={sentimentToWarningBarColor(value.warning.sentiment)}
            />
          )}
          {value.description && (
            <Markdown className="mt-1.5 font-normal leading-snug text-black/80 dark:text-white/80 md:text-lg">
              {value.description}
            </Markdown>
          )}
        </>
      )}
    </div>
  )
}
