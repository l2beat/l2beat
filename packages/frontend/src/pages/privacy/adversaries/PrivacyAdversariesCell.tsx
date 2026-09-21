import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { PrivacySentimentDot } from '../PrivacySentimentDot'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import {
  getPrivacyAdversariesSentence,
  getPrivacyAdversaryAnchor,
} from './privacyAdversaryUi'

/**
 * The privacy assessment as one sentence over the per-adversary dots: the
 * sentence answers how many adversaries the promise survives, the dots which
 * ones. The dots stay hoverable and keep linking into the project page.
 */
export function PrivacyAdversariesCell({
  adversaries,
  href,
  className,
}: {
  adversaries: PrivacyAdversariesSummary
  /** Page each dot links into; no link when omitted. */
  href?: string
  className?: string
}) {
  const { subject, held, total } = getPrivacyAdversariesSentence(adversaries)

  return (
    <div
      className={cn('flex flex-col items-start gap-1.5 text-left', className)}
    >
      <p className="text-pretty text-xs leading-[15px] md:text-sm md:leading-[1.2]">
        <span className="font-semibold">{subject}</span> is private against{' '}
        <span className="font-semibold tabular-nums">
          {held}/{total}
        </span>{' '}
        adversaries.
      </p>
      <div className="flex items-center gap-1">
        {adversaries.cells.map((cell) => {
          const dot = (
            <PrivacySentimentDot sentiment={cell.sentiment} size="xs" />
          )
          const label = `${cell.label}: ${cell.value}`
          return (
            <Tooltip key={cell.id}>
              {href === undefined ? (
                <TooltipTrigger aria-label={label}>{dot}</TooltipTrigger>
              ) : (
                <TooltipTrigger asChild>
                  <a
                    href={`${href}#${getPrivacyAdversaryAnchor(cell.id)}`}
                    aria-label={label}
                  >
                    {dot}
                  </a>
                </TooltipTrigger>
              )}
              <TooltipContent className="max-w-[340px]">
                <PrivacyAdversaryTooltipContent
                  cell={cell}
                  hint={
                    href === undefined
                      ? undefined
                      : 'Click for the full assessment.'
                  }
                />
              </TooltipContent>
            </Tooltip>
          )
        })}
      </div>
    </div>
  )
}
