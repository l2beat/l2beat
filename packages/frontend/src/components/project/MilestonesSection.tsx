import { Milestone } from '@l2beat/config'
import React from 'react'

import { ExpandableContainer } from '../ExpandableContainer'
import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'
import { Link } from '../Link'
import { Markdown } from '../Markdown'
import { ProjectDetailsSection } from './ProjectDetailsSection'
import { ProjectSectionId } from './sectionId'

export interface MilestonesSectionProps {
  title: string
  id: ProjectSectionId
  sectionOrder: number
  milestones: Milestone[]
}

export function MilestonesSection(props: MilestonesSectionProps) {
  return (
    <ProjectDetailsSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
    >
      <ExpandableContainer
        className="relative"
        gradientClassName="from-white dark:from-neutral-900 md:from-gray-100 md:dark:from-zinc-900"
      >
        <div className="absolute left-[15.4px] mt-2 h-[100%]">
          <div className="h-[60%] w-[1.7px] bg-green-400 dark:w-px dark:bg-green-500 " />
          <div className="h-[40%] w-[1.7px] bg-gradient-to-b from-green-400 dark:w-px dark:from-green-500" />
        </div>
        <div className="ml-10">
          {props.milestones
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
                    <Markdown className="text-sm leading-none dark:text-gray-400">
                      {milestone.description}
                    </Markdown>
                  )}
                  <Link className="text-sm" href={milestone.link} showArrow>
                    Learn more
                  </Link>
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
