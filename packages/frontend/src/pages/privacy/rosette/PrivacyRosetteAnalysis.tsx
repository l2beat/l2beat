import { UnderReviewBadge } from '~/components/badge/UnderReviewBadge'
import { TooltipVisualOnly } from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteWithLabels } from '~/components/rosette/pizza/PizzaRosetteWithLabels'
import { SentimentText } from '~/components/SentimentText'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversaryRosetteValues,
  PRIVACY_ADVERSARY_VERDICT,
} from '../adversaries/privacyAdversaryUi'

/**
 * The privacy take on the L2 risk analysis, with each verdict explained by
 * its reason. Shown in a tooltip from md up and in a drawer below it.
 */
export function PrivacyRosetteAnalysis({
  adversaries,
  isUnderReview,
}: {
  adversaries: PrivacyAdversariesSummary
  isUnderReview: boolean
}) {
  if (isUnderReview) {
    return (
      <div className="text-wrap md:w-[300px]">
        <div className="mb-3">
          <span className="text-heading-16">Privacy risk analysis</span> is{' '}
          <UnderReviewBadge />
        </div>
        <p>
          Projects under review might present uncompleted information & data.
          <br />
          L2BEAT Team is working to research & validate content before
          publishing.
        </p>
      </div>
    )
  }

  return (
    // Tooltips inherit `white-space: pre` from the table.
    <div className="flex flex-col text-wrap md:w-[720px] md:max-w-full">
      <span className="mb-2 text-heading-16">Privacy risk analysis</span>
      <div className="flex flex-col items-center gap-4 md:flex-row md:gap-6">
        <TooltipVisualOnly>
          <PizzaRosetteWithLabels
            values={getPrivacyAdversaryRosetteValues(adversaries)}
          />
        </TooltipVisualOnly>
        <ul className="w-full min-w-0 flex-1 divide-y divide-divider">
          {adversaries.cells.map((cell) => (
            <li key={cell.id} className="py-2.5 first:pt-0 last:pb-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-semibold text-label-value-14">
                  {cell.label}
                </span>
                <SentimentText
                  sentiment={cell.sentiment}
                  vibrant
                  className="shrink-0 font-semibold text-label-value-13"
                >
                  {PRIVACY_ADVERSARY_VERDICT[cell.sentiment]}
                </SentimentText>
              </div>
              <p className="mt-1 font-normal text-paragraph-13 text-secondary">
                {cell.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
