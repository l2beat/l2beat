import { OverflowWrapper } from '../../core/OverflowWrapper'
import type { BadgeWithParams } from '../ProjectBadge'
import { ProjectBadge } from '../ProjectBadge'

interface BadgesSectionProps {
  badges: BadgeWithParams[]
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 lg:min-w-[288px]">
      <h2 className="subtitle-12 text-secondary uppercase">Badges</h2>
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
