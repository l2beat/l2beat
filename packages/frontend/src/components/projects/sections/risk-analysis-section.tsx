import { RoundedWarningIcon } from '~/icons/rounded-warning'
import { ShieldIcon } from '~/icons/shield'
import { UnverifiedIcon } from '~/icons/unverified'
import { UnderReviewBadge } from '../../badge/under-review-badge'
import { Markdown } from '../../markdown/markdown'
import { BigPentagonRosette } from '../../rosette/pentagon/big-pentagon-rosette'
import { BigPizzaRosette } from '../../rosette/pizza/big-pizza-rosette'
import { type RosetteValue } from '../../rosette/types'
import { SentimentText } from '../../sentiment-text'
import { WarningBar } from '../../warning-bar'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

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
