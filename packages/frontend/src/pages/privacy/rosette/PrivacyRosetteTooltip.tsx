import { UnderReviewBadge } from '~/components/badge/UnderReviewBadge'
import { TooltipVisualOnly } from '~/components/core/tooltip/Tooltip'
import { RiskValue } from '~/components/rosette/RiskValue'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import {
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryGist,
  PRIVACY_ADVERSARY_VERDICT,
} from '../adversaries/privacyAdversaryUi'
import { PrivacyRosetteFigure } from './PrivacyRosetteFigure'

interface Props {
  adversaries: PrivacyAdversariesSummary
  isUnderReview?: boolean
  /** Set under the analysis, e.g. what clicking the rosette does. */
  hint?: string
}

/**
 * The privacy take on the L2 "Risk analysis" card: the same labelled rosette
 * beside the verdicts, each with its gist alongside so the tooltip explains
 * itself. The full assessment stays on the project page. On mobile the same
 * content opens in a drawer instead, see PrivacyRosetteDrawer.
 */
export function PrivacyRosetteTooltip({
  adversaries,
  isUnderReview,
  hint,
}: Props) {
  if (isUnderReview) {
    return (
      <div className="w-[300px] text-wrap">
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
        {hint && <p className="mt-3 text-secondary text-xs">{hint}</p>}
      </div>
    )
  }

  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)

  return (
    // The tooltip inherits `white-space: pre` from the table, so wrapping has
    // to be asked for explicitly or the gists run past the panel.
    <div className="flex w-[720px] max-w-full flex-col text-wrap">
      <span className="text-heading-16">Privacy risk analysis</span>
      <p className="mt-1 font-medium text-xs leading-normal">
        {subject} is private against {held}/{total} adversaries.
      </p>
      <div className="mt-3 flex items-center gap-6">
        <TooltipVisualOnly>
          <PrivacyRosetteFigure adversaries={adversaries} />
        </TooltipVisualOnly>
        {/* One row per adversary: the verdict beside its gist rather than
            above it, so each row is two or three lines and the list stays
            level with the rosette. */}
        <div className="grid min-w-0 flex-1 grid-cols-[auto_minmax(0,1fr)] items-start gap-x-4 gap-y-3">
          {adversaries.cells.map((cell) => (
            <div key={cell.id} className="col-span-2 grid grid-cols-subgrid">
              <RiskValue
                name={cell.label}
                value={PRIVACY_ADVERSARY_VERDICT[cell.sentiment]}
                sentiment={cell.sentiment}
              />
              <p className="text-secondary text-xs leading-snug">
                {getPrivacyAdversaryGist(cell.exposure)}
              </p>
            </div>
          ))}
        </div>
      </div>
      {hint && <p className="mt-3 text-secondary text-xs">{hint}</p>}
    </div>
  )
}
