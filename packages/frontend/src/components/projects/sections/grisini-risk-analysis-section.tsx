import { SingleGrisiniDetails } from '~/components/grisini/single-grisini-details'
import { type GrisiniValue } from '~/components/grisini/types'
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

export interface GrisiniRiskAnalysisSectionProps extends ProjectSectionProps {
  isVerified: boolean | undefined
  grisiniValues: GrisiniValue[]
}

export function GrisiniRiskAnalysisSection({
  isVerified,
  grisiniValues,
  ...sectionProps
}: GrisiniRiskAnalysisSectionProps) {
  const isUnderReview =
    !!sectionProps.isUnderReview ||
    Object.values(grisiniValues).some(
      ({ sentiment }) => sentiment === 'UnderReview',
    )
  return (
    <ProjectSection {...sectionProps} isUnderReview={isUnderReview}>
      {Object.values(grisiniValues).map((value) => (
        <div className="flex flex-col gap-2 key={value.name}">
          <SingleGrisiniDetails {...value} />
          {value.description && (
            <Markdown className="mt-1.5 font-normal leading-snug text-black/80 dark:text-white/80 md:text-lg">
              {value.description}
            </Markdown>
          )}
        </div>
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
            sentiment={value.sentiment}
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
              color={value.warning.sentiment === 'bad' ? 'red' : 'yellow'}
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
