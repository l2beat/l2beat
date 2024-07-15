import React from 'react'

import { usePageBuildContext } from '../../../../build/pageBuildContext'
import { OverflowWrapper } from '../../../../components/OverflowWrapper'
import { ReadMore } from '../../../../components/ReadMore'
import { cn } from '../../../../utils/cn'
import { ProjectBadge } from './ProjectBadge'

// NOTE: We cannot import from `@l2beat/config` because it uses native node modules
// and Storybook does not support it. Change when we transition to using "exports" field
// in `@l2beat/config`'s `package.json` or move the badge definitions somewhere else.
import {
  type BadgeId,
  badgesCompareFn,
} from '@l2beat/config/build/src/projects/badges'

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
  const badges: BadgeId[] = ((badgesEnabled && projectBadges) || []).sort(
    badgesCompareFn,
  )

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
          <p>
            <ReadMore>{description}</ReadMore>
          </p>
        </div>
      )}
    </div>
  )
}
