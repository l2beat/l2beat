import type { ScalingProjectBadge } from '@l2beat/config'
import { OverflowWrapper } from '../../core/overflow-wrapper'
import { ProjectBadge } from '../project-badge'

interface BadgesSectionProps {
  badges: ScalingProjectBadge[]
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 lg:min-w-[288px]">
      <h2 className="text-xs font-medium uppercase text-secondary">Badges</h2>
      <OverflowWrapper className="max-md:-mx-4">
        <div className="flex flex-row gap-1 max-md:px-4 lg:flex-wrap">
          {badges.map((badge, key) => (
            <ProjectBadge key={key} badge={badge} />
          ))}
        </div>
      </OverflowWrapper>
    </div>
  )
}
