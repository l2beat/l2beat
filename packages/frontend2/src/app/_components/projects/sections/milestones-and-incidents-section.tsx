'use client'

import { type Milestone } from '@l2beat/config'
import React, { useState } from 'react'
import ChevronDownIcon from '~/icons/chevron.svg'
import { IncidentIcon } from '~/icons/incident'
import { MilestoneIcon } from '~/icons/milestone'
import { cn } from '~/utils/cn'
import { Button } from '../../button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../../collapsible'
import { CustomLink } from '../../link/custom-link'
import { Markdown } from '../../markdown/markdown'
import { ProjectSection } from './project-section'
import { type ProjectSectionProps } from './types'

export interface MilestonesAndIncidentsSectionProps
  extends ProjectSectionProps {
  milestones: Milestone[]
}

export function MilestonesAndIncidentsSection({
  milestones,
  ...sectionProps
}: MilestonesAndIncidentsSectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <ProjectSection {...sectionProps}>
      {milestones.length < 3 ? (
        <MilestonesBase milestones={milestones} />
      ) : (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <MilestonesBase
            milestones={milestones}
            isOpen={isOpen}
            range={[0, 2]}
          />
          <CollapsibleContent>
            <MilestonesBase milestones={milestones} range={[2]} />
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              className="group mx-auto mt-1 flex w-min justify-between gap-2.5"
              variant="purple"
            >
              <span className="w-[76px] whitespace-pre text-left text-sm font-bold">
                {isOpen ? 'Show less' : 'Show more'}
              </span>
              <ChevronDownIcon className="transition-transform duration-300 group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      )}
    </ProjectSection>
  )
}

function MilestonesBase(props: {
  milestones: Milestone[]
  range?: [number, number?]
  isOpen?: boolean
}) {
  return (
    <div className="relative">
      <div className="ml-10">
        {props.milestones
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((milestone, i) => {
            if (
              i < (props.range?.[0] ?? 0) ||
              (props.range?.[1] && i >= props.range[1])
            ) {
              return null
            }

            // Milestones may have a type of 'general' or 'incident'
            // When the type is undefined, it is considered 'general'

            const milestoneType = milestone.type ?? 'general'
            const previousMilestone = props.milestones.at(i + 1)
            const previousMilestoneType =
              previousMilestone && (previousMilestone.type ?? 'general')

            const Icon =
              milestoneType === 'incident' ? IncidentIcon : MilestoneIcon

            const milestoneLineClassName = previousMilestoneType
              ? cn(
                  milestoneType === 'general' &&
                    'bg-green-400 dark:bg-green-500',
                  milestoneType === 'incident' && 'bg-red-700 dark:bg-red-700',
                  previousMilestoneType === 'incident' &&
                    milestoneType === 'general' &&
                    'bg-gradient-to-b from-green-400 to-red-700 dark:from-green-500 dark:to-red-700',
                  previousMilestoneType === 'general' &&
                    milestoneType === 'incident' &&
                    'bg-gradient-to-b from-red-700 to-green-400 dark:from-red-700 dark:to-green-500',
                )
              : cn(
                  'h-3/4 bg-gradient-to-b',
                  milestoneType === 'incident' &&
                    'from-red-700 dark:from-red-700',
                  milestoneType === 'general' &&
                    'from-green-400 dark:from-green-500',
                )

            return (
              <div key={i} className="relative pb-7">
                <div
                  className={cn(
                    'absolute left-[-1.445rem] top-3 h-full w-[1.7px] dark:w-px',
                    milestoneLineClassName,
                  )}
                />
                <Icon className="absolute -left-8" />
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
                  <CustomLink className="text-sm" href={milestone.link}>
                    Learn more
                  </CustomLink>
                </div>
              </div>
            )
          })}
      </div>
    </div>
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
