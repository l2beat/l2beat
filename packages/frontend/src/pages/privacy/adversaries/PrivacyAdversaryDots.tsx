import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import { TrustedSetupRiskDot } from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { sentimentToRiskDot } from '../sentimentToRiskDot'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import { getPrivacyAdversaryAnchor } from './privacyAdversaryUi'

/** One dot per adversary, in spine order. Hover for the cell. */
export function PrivacyAdversaryDots({
  adversaries,
  href,
  size = 'sm',
  className,
}: {
  adversaries: PrivacyAdversariesSummary
  /** Page each dot links into, '' for the current one; no link when omitted. */
  href?: string
  size?: 'sm' | 'md'
  className?: string
}) {
  return (
    <div className={cn('flex items-center gap-1.5', className)}>
      {adversaries.cells.map((cell) => {
        const dot = (
          <TrustedSetupRiskDot
            risk={sentimentToRiskDot(cell.sentiment)}
            size={size}
            className="shrink-0"
          />
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
  )
}
