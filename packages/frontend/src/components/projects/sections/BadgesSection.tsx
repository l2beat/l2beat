import { cn } from '~/utils/cn'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '../../core/tooltip/Tooltip'
import { OverflowWrapper } from '../../core/OverflowWrapper'
import type { BadgeWithParams } from '../ProjectBadge'
import { ProjectBadge } from '../ProjectBadge'

interface BadgesSectionProps {
  badges: BadgeWithParams[]
  hideTitle?: boolean
  className?: string
  onBadgeClick?: (badgeId: string) => void
}

export function BadgesSection({
  badges,
  hideTitle,
  className,
  onBadgeClick,
}: BadgesSectionProps) {
  return (
    <div
      className={cn('flex shrink-0 flex-col gap-2 lg:min-w-[288px]', className)}
    >
      {!hideTitle && (
        <h2 className="text-secondary text-subtitle-12 uppercase max-md:hidden">
          Badges
        </h2>
      )}
      <OverflowWrapper className="-m-4">
        <div className="flex flex-row gap-1 p-4 lg:flex-wrap">
          {badges.map((badge) =>
            onBadgeClick ? (
              <Tooltip key={badge.id} delayDuration={0}>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    title={badge.name}
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                    onClick={() => onBadgeClick(badge.id)}
                  >
                    <ProjectBadge
                      badge={badge}
                      disableInteraction
                      disableTooltip
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <span className="mb-1 block font-medium text-label-value-14">
                    {badge.name}
                  </span>
                  <span>{badge.description}</span>
                </TooltipContent>
              </Tooltip>
            ) : (
              <ProjectBadge key={badge.id} badge={badge} />
            ),
          )}
        </div>
      </OverflowWrapper>
    </div>
  )
}
