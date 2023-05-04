import { Milestone } from '@l2beat/config'
import React from 'react'

import { ExpandableContainer } from '../ExpandableContainer'
import { ArrowRightIcon } from '../icons'
import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'
import { OutLink } from '../OutLink'
import { ProjectDetailsSection } from './ProjectDetailsSection'

export interface MilestonesSectionProps {
  title: string
  id: string
  milestones: Milestone[]
}

export function MilestonesSection({
  milestones,
  title,
  id,
}: MilestonesSectionProps) {
  return (
    <ProjectDetailsSection title={title} id={id}>
      <ExpandableContainer className="relative">
        <div className="absolute left-[15.4px] mt-2 h-[100%]">
          <div className="h-[60%] w-[1.7px] bg-green-400 dark:w-px dark:bg-green-500 " />
          <div className="h-[40%] w-[1.7px] bg-gradient-to-b from-green-400 dark:w-px dark:from-green-500" />
        </div>
        <div className="ml-10">
          {milestones
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((milestone, i) => (
              <div key={i} className="pb-7">
                <MilestoneIcon className="absolute left-1.5" />
                <p className="text-lg font-bold leading-none">
                  {milestone.name}
                </p>
                <p className="text-sm dark:text-gray-400">
                  {formatDate(milestone.date)}
                </p>
                <div className="mt-3">
                  {milestone.description && (
                    <p className="text-sm leading-none dark:text-gray-400">
                      {milestone.description}
                    </p>
                  )}
                  <OutLink
                    className="flex flex-wrap items-center gap-1 text-sm font-bold text-link underline"
                    href={milestone.link}
                  >
                    Learn more
                    <ArrowRightIcon className="fill-link" />
                  </OutLink>
                </div>
              </div>
            ))}
        </div>
      </ExpandableContainer>
    </ProjectDetailsSection>
  )
}

function formatDate(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = date.toLocaleDateString('en', {
    month: 'short',
  })
  const day = date.toLocaleDateString('en', {
    day: 'numeric',
  })

  const ending = getOrdinalSuffix(date.getDate())

  return `${year} ${month} ${day}${ending}`
}

function getOrdinalSuffix(days: number) {
  if (days > 3 && days < 21) return 'th'
  switch (days % 10) {
    case 1:
      return 'st'
    case 2:
      return 'nd'
    case 3:
      return 'rd'
    default:
      return 'th'
  }
}
