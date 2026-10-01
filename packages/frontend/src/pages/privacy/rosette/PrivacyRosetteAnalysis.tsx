import { UnderReviewBadge } from '~/components/badge/UnderReviewBadge'
import { TooltipVisualOnly } from '~/components/core/tooltip/Tooltip'
import { PizzaRosetteWithLabels } from '~/components/rosette/pizza/PizzaRosetteWithLabels'
import { RiskValue } from '~/components/rosette/RiskValue'
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
        <ul className="grid w-full gap-x-4 gap-y-3 md:grid-cols-[auto_minmax(0,1fr)]">
          {adversaries.cells.map((cell) => (
            <li
              key={cell.id}
              className="grid gap-1 md:col-span-2 md:grid-cols-subgrid"
            >
              <RiskValue
                name={cell.label}
                value={PRIVACY_ADVERSARY_VERDICT[cell.sentiment]}
                sentiment={cell.sentiment}
              />
              <p className="text-secondary text-xs leading-snug">
                {cell.reason}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
