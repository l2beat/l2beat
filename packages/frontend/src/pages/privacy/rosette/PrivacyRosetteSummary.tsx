import { PizzaRosetteWithLabels } from '~/components/rosette/pizza/PizzaRosetteWithLabels'
import { RiskAnalysisUnderReview } from '~/components/rosette/RiskAnalysisUnderReview'
import type { RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/SentimentText'
import { PRIVACY_ASSESSMENT_TITLE } from './PrivacyRosetteAnalysis'

/**
 * The verdicts beside the labelled rosette, as the L2 risk rosette tooltip
 * shows them. The reasons stay in the drawer and on the project page.
 * Unlike the L2 `RiskValue`, names are 11px: a privacy verdict is one word,
 * so the name carries the row.
 */
export function PrivacyRosetteSummary({
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
      <span className="mb-2 text-heading-16">{PRIVACY_ASSESSMENT_TITLE}</span>
      <div className="flex items-center gap-6">
        <PizzaRosetteWithLabels values={values} />
        <div className="flex flex-col gap-3">
          {values.map((value) => (
            <div key={value.name} className="font-medium">
              <span className="mb-0.5 block text-subtitle-11 uppercase">
                {value.name}
              </span>
              <SentimentText
                sentiment={value.sentiment ?? 'neutral'}
                vibrant
                className="block font-medium text-label-value-15"
              >
                {value.value}
              </SentimentText>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
