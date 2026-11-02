import { RiskAnalysisUnderReview } from '~/components/rosette/RiskAnalysisUnderReview'
import type { RosetteValue } from '~/components/rosette/types'

export const PRIVACY_ASSESSMENT_TITLE = 'Privacy assessment'

/**
 * Each privacy verdict with its reason, as plain text for the tooltip's HTML
 * copy, which crawlers and screen readers read; the popup shows no reasons.
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
    <>
      <span>{PRIVACY_ASSESSMENT_TITLE}</span>
      <ul>
        {values.map((value) => (
          <li key={value.name}>
            {value.name}: {value.value}. {value.description}
          </li>
        ))}
      </ul>
    </>
  )
}
