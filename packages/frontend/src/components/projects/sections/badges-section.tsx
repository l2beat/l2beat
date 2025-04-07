import { OverflowWrapper } from '../../core/overflow-wrapper'
import type { BadgeWithParams } from '../project-badge'
import { ProjectBadge } from '../project-badge'

interface BadgesSectionProps {
  badges: BadgeWithParams[]
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 lg:min-w-[288px]">
      <h2 className="text-xs font-medium uppercase text-secondary">Badges</h2>
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
