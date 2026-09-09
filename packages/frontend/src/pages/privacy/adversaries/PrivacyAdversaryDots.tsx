import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import {
  TrustedSetupRiskDot,
  type TrustedSetupRiskDotSize,
} from '~/pages/zk-catalog/v2/components/TrustedSetupRiskDot'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { sentimentToRiskDot } from '../sentimentToRiskDot'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import { getPrivacyAdversaryAnchor } from './privacyAdversaryUi'

/** One dot per adversary, in spine order. Hover for the cell. */
export function PrivacyAdversaryDots({
  adversaries,
  size = 'sm',
  className,
  linkToSection = false,
}: {
  adversaries: PrivacyAdversariesSummary
  size?: TrustedSetupRiskDotSize
  className?: string
  /** On the project page: jump to the adversary's block in the section. */
  linkToSection?: boolean
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
            {linkToSection ? (
              <TooltipTrigger asChild>
                <a
                  href={`#${getPrivacyAdversaryAnchor(cell.id)}`}
                  aria-label={label}
                >
                  {dot}
                </a>
              </TooltipTrigger>
            ) : (
              <TooltipTrigger aria-label={label}>{dot}</TooltipTrigger>
            )}
            <TooltipContent className="max-w-[320px]">
              <PrivacyAdversaryTooltipContent
                cell={cell}
                promise={adversaries.promise}
                hint={
                  linkToSection ? 'Click for the full assessment.' : undefined
                }
              />
            </TooltipContent>
          </Tooltip>
        )
      })}
    </div>
  )
}
