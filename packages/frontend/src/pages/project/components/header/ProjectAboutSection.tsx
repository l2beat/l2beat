import React from 'react'

import { type BadgeId } from '@l2beat/config'
import { OverflowWrapper } from '../../../../components/OverflowWrapper'
import { cn } from '../../../../utils/cn'
import { ProjectBadge } from './ProjectBadge'

export function ProjectAboutSection({
  badges: _,
  className,
  description,
}: {
  badges: BadgeId[] | undefined
  className?: string
  description: string | undefined
}) {
  // TODO: ONLY FOR TESTING PURPOSES, REMOVE LATER
  const badges: BadgeId[] = [
    'AltLayer',
    'Avail',
    'Caldera',
    'Celestia',
    'Conduit',
    'EigenDA',
  ]
  return (
    <div
      className={cn(
        'mt-6 flex flex-col gap-4 px-4 md:px-0',
        (description?.length ?? 0) < 260 && 'lg:flex-row lg:gap-8',
        className,
      )}
    >
      {badges && (
        <div className="flex shrink-0 flex-col gap-3 lg:min-w-[288px]">
          <h2 className="font-medium text-gray-600 text-xs uppercase">
            Badges
          </h2>
          <OverflowWrapper within="full-page-header">
            <div className="flex flex-row gap-1 lg:flex-wrap">
              {badges.map((id) => (
                <ProjectBadge id={id} />
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
