import { RiskAnalysisUnderReview } from '~/components/rosette/RiskAnalysisUnderReview'
import type { RosetteValue } from '~/components/rosette/types'

export const PRIVACY_ASSESSMENT_TITLE = 'Privacy assessment'

/**
 * Each privacy verdict with its reason, as plain text for the tooltip's HTML
 * copy, which crawlers read; the popup shows no reasons.
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
        {getPrivacyVerdictSentences(values).map((sentence) => (
          <li key={sentence}>{sentence}</li>
        ))}
      </ul>
    </>
  )
}

/** What screen readers announce for the tooltip, which shows no reasons. */
export function getPrivacyAssessmentLabel(values: RosetteValue[]) {
  return [
    `${PRIVACY_ASSESSMENT_TITLE}.`,
    ...getPrivacyVerdictSentences(values),
  ].join(' ')
}

function getPrivacyVerdictSentences(values: RosetteValue[]) {
  return values.map(
    (value) => `${value.name}: ${value.value}. ${value.description}`,
  )
}
