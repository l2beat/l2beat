import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/core/tooltip/Tooltip'
import type { PrivacyAdversariesSummary } from '~/server/features/privacy/types'
import { cn } from '~/utils/cn'
import { PrivacyAdversaryTooltipContent } from './PrivacyAdversaryTooltipContent'
import { PrivacySubjectGlyph, sentimentToExposure } from './PrivacySubjectGlyph'
import { getPrivacyAdversaryAnchor, worstExtraLeak } from './privacyAdversaryUi'

/** One glyph per adversary, in spine order. Hover for the cell. */
export function PrivacyAdversaryDots({
  adversaries,
  size = 'sm',
  className,
  linkToSection = false,
}: {
  adversaries: PrivacyAdversariesSummary
  size?: 'sm' | 'md' | 'lg'
  className?: string
  /** On the project page: jump to the adversary's block in the section. */
  linkToSection?: boolean
}) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {adversaries.cells.map((cell) => {
        const glyph = (
          <PrivacySubjectGlyph
            field={adversaries.promise.protects}
            exposure={sentimentToExposure(cell.sentiment)}
            more={worstExtraLeak(cell)}
            size={size}
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
                  {glyph}
                </a>
              </TooltipTrigger>
            ) : (
              <TooltipTrigger aria-label={label}>{glyph}</TooltipTrigger>
            )}
            <TooltipContent className="max-w-[340px]">
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
