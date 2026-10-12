import { TooltipVisualOnly } from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteWithLabels } from '~/components/rosette/pizza/PizzaRosetteWithLabels'
import { RiskAnalysisUnderReview } from '~/components/rosette/RiskAnalysisUnderReview'
import type { RosetteValue } from '~/components/rosette/types'
import { SentimentText } from '~/components/SentimentText'

const TITLE = 'Privacy assessment'

/**
 * The privacy take on the L2 risk analysis, with each verdict explained by
 * its reason. Shown in a tooltip from md up and in a drawer below it.
 */
export function PrivacyRosetteAnalysis({
  values,
  isUnderReview,
}: {
  values: RosetteValue[]
  isUnderReview: boolean
}) {
  if (isUnderReview) {
    return <RiskAnalysisUnderReview title={TITLE} />
  }

  return (
    // Tooltips inherit `white-space: pre` from the table.
    <div className="flex flex-col text-wrap md:w-[720px] md:max-w-full">
      <span className="mb-2 text-heading-16">{TITLE}</span>
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <TooltipVisualOnly>
          <PizzaRosetteWithLabels values={values} />
        </TooltipVisualOnly>
        <ul className="w-full min-w-0 flex-1 divide-y divide-divider">
          {values.map((value) => (
            <li key={value.name} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-label-value-14">
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
              <p className="mt-1 font-normal text-paragraph-13 text-secondary">
                {value.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
