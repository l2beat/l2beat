import React from 'react'

import { type BadgeId } from '@l2beat/config'
import { OverflowWrapper } from '../../../../components/OverflowWrapper'
import { cn } from '../../../../utils/cn'
import { ProjectBadge } from './ProjectBadge'
import { usePageBuildContext } from '../../../../build/pageBuildContext'

export function ProjectAboutSection({
  badges: projectBadges,
  className,
  description,
  type = 'desktop',
}: {
  badges: BadgeId[] | undefined
  className?: string
  description: string | undefined
  type?: 'mobile' | 'desktop'
}) {
  const {
    config: {
      features: { badges: badgesEnabled },
    },
  } = usePageBuildContext()
  const badges: BadgeId[] = (badgesEnabled && projectBadges) || []

  return (
    <div
      className={cn(
        'mt-6 flex flex-col gap-4 px-4 md:px-0',
        (description?.length ?? 0) < 260 && 'lg:flex-row lg:gap-8',
        type === 'mobile' && '-mx-4 mt-2 px-4',
        className,
      )}
    >
      {badges.length > 0 && (
        <div className="flex shrink-0 flex-col gap-3 lg:min-w-[288px]">
          <h2 className="font-medium text-gray-600 text-xs uppercase">
            Badges
          </h2>
          <OverflowWrapper
            within="details-header"
            className={cn(type === 'mobile' ? '-mx-4' : '')}
          >
            <div
              className={cn(
                'flex flex-row gap-1 lg:flex-wrap',
                type === 'mobile' && 'px-4',
              )}
            >
              {badges.map((id, key) => (
                <ProjectBadge key={key} id={id} />
              ))}
            </div>
          </OverflowWrapper>
        </div>
      )}
      {description && (
        <div className="flex flex-1 flex-col gap-2 text-base lg:min-w-[400px]">
          <h2 className="font-medium text-gray-600 text-xs uppercase">About</h2>
          <p>{description}</p>
        </div>
      )}
    </div>
  )
}
