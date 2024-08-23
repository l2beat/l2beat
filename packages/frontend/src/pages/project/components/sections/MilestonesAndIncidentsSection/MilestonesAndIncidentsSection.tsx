import { Milestone } from '@l2beat/config'
import React from 'react'

import { Link } from '../../../../../components/Link'
import { Markdown } from '../../../../../components/Markdown'
import { IncidentIcon } from '../../../../../components/icons/symbols/IncidentIcon'
import { MilestoneIcon } from '../../../../../components/icons/symbols/MilestoneIcon'
import { cn } from '../../../../../utils/cn'
import { ProjectSection } from '../common/ProjectSection'
import { ProjectSectionId } from '../common/sectionId'
import { ExpandableContainer } from './ExpandableContainer'

export interface MilestonesAndIncidentsSectionProps {
  title: string
  id: ProjectSectionId
  sectionOrder: number
  milestones: Milestone[]
}

export function MilestonesAndIncidentsSection(
  props: MilestonesAndIncidentsSectionProps,
) {
  return (
    <ProjectSection
      title={props.title}
      id={props.id}
      sectionOrder={props.sectionOrder}
    >
      <ExpandableContainer
        className="relative"
        gradientClassName="from-white dark:from-neutral-900 md:from-gray-100 md:dark:from-zinc-900"
      >
        <div className="ml-10">
          {props.milestones
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((milestone, i) => {
              const previousMilestone = props.milestones.at(i + 1)

              const Icon =
                milestone.type === 'incident' ? IncidentIcon : MilestoneIcon

              const milestoneLineClassName = previousMilestone?.type
                ? cn(
                    milestone.type === 'general' &&
                      'bg-green-400 dark:bg-green-500',
                    milestone.type === 'incident' &&
                      'bg-red-700 dark:bg-red-700',
                    previousMilestone.type === 'incident' &&
                      milestone.type === 'general' &&
                      'bg-gradient-to-b from-green-400 to-red-700 dark:from-green-500 dark:to-red-700',
                    previousMilestone.type === 'general' &&
                      milestone.type === 'incident' &&
                      'bg-gradient-to-b from-red-700 to-green-400 dark:from-red-700 dark:to-green-500',
                  )
                : cn(
                    'h-3/4 bg-gradient-to-b',
                    milestone.type === 'incident' &&
                      'from-red-700 dark:from-red-700',
                    milestone.type === 'general' &&
                      'from-green-400 dark:from-green-500',
                  )

              return (
                <div key={i} className="relative pb-7">
                  <div
                    className={cn(
                      '-left-[1.445rem] absolute top-3 h-full w-[1.7px] dark:w-px',
                      milestoneLineClassName,
                    )}
                  />
                  <Icon className="-left-8 absolute" />
                  <p className="font-bold text-lg leading-none">
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
              )
            })}
        </div>
      </ExpandableContainer>
    </ProjectSection>
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
