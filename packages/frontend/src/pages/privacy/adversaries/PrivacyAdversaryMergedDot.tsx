import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { PRIVACY_ASSESSMENT } from '../privacyAssessment'
import { PrivacySentimentDot } from '../PrivacySentimentDot'
import {
  getPrivacyAdversariesTableValue,
  getPrivacyAdversaryTitle,
} from './privacyAdversaryUi'

/** All adversaries folded into one dot; hover lists each of them. */
export function PrivacyAdversaryMergedDot({
  adversaries,
}: {
  adversaries: PrivacyAdversariesSummary
}) {
  const { sentiment } = getPrivacyAdversariesTableValue(adversaries)
  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`${PRIVACY_ASSESSMENT.title}: ${adversaries.promiseLabel}`}
      >
<PrivacySentimentDot sentiment={sentiment} />
      </TooltipTrigger>
      <TooltipContent className="max-w-[340px]">
        <div className="space-y-2">
          <div className="font-bold text-label-value-14">
            {PRIVACY_ASSESSMENT.title}
          </div>
          <p className="text-secondary text-xs">{adversaries.promise.text}</p>
          <ul className="space-y-1">
            {adversaries.cells.map((cell) => (
              <li key={cell.id} className="flex items-center gap-2 text-xs">
<PrivacySentimentDot sentiment={cell.sentiment} />
                <span className="font-medium">
                  {getPrivacyAdversaryTitle(cell.label)}:
                </span>
                <span>{cell.value}</span>
              </li>
            ))}
          </ul>
          <p className="text-secondary text-xs">
            The dot is red if any adversary except the future one is red,
            otherwise the majority colour, green on a tie. See the privacy page
            for the full assessment.
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
