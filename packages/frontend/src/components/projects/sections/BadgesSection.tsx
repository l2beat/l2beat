import { cn } from '~/utils/cn'
import { OverflowWrapper } from '../../core/OverflowWrapper'
import type { BadgeWithParams } from '../ProjectBadge'
import { ProjectBadge } from '../ProjectBadge'

interface BadgesSectionProps {
  badges: BadgeWithParams[]
  hideTitle?: boolean
  className?: string
}

export function BadgesSection({
  badges,
  hideTitle,
  className,
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
          {badges.map((badge, key) => (
            <ProjectBadge key={key} badge={badge} />
          ))}
        </div>
      </OverflowWrapper>
    </div>
  )
}
