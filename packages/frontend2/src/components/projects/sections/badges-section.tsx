import { type BadgeId } from '@l2beat/config'
import { OverflowWrapper } from '../../core/overflow-wrapper'
import { ProjectBadge } from '../project-badge'

interface BadgesSectionProps {
  badges: BadgeId[]
}

export function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 lg:min-w-[288px]">
      <h2 className="text-xs font-medium uppercase text-gray-600">Badges</h2>
      <OverflowWrapper className="max-md:-mx-4">
        <div className="flex flex-row gap-1 max-md:px-4 lg:flex-wrap">
          {badges.map((id, key) => (
            <ProjectBadge key={key} id={id} />
          ))}
        </div>
      </OverflowWrapper>
    </div>
  )
}
