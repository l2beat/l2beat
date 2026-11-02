import { RiskAnalysisUnderReview } from '~/components/rosette/RiskAnalysisUnderReview'
import type { RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/SentimentText'

export const PRIVACY_ASSESSMENT_TITLE = 'Privacy assessment'

/**
 * The privacy take on the L2 risk analysis, with each verdict explained by
 * its reason. Shown in the drawer below md, and in the tooltip's HTML copy.
 */
export function PrivacyRosetteAnalysis({
  values,
  isUnderReview,
}: {
  values: RosetteValue[]
  isUnderReview: boolean
}) {
  if (isUnderReview) {
    return <RiskAnalysisUnderReview title={PRIVACY_ASSESSMENT_TITLE} />
  }

  return (
    <div className="flex flex-col">
      <span className="mb-3 text-heading-16">{PRIVACY_ASSESSMENT_TITLE}</span>
      <ul className="flex flex-col gap-3">
        {values.map((value) => (
          <li key={value.name}>
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold text-label-value-13">
                {value.name}
              </span>
              <SentimentText
                sentiment={value.sentiment ?? 'neutral'}
                vibrant
                className="shrink-0 font-semibold text-label-value-13"
              >
                {value.value}
              </SentimentText>
            </div>
            <p className="mt-0.5 text-pretty font-normal text-paragraph-13 text-secondary">
              {value.description}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
