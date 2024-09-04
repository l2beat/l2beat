'use client'

import { type Milestone } from '@l2beat/config'
import { useState } from 'react'
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

  const milestonesWithNext = withNext(milestones)

  return (
    <ProjectSection {...sectionProps}>
      {milestones.length < 3 ? (
        <MilestonesBase milestones={milestonesWithNext} />
      ) : (
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <MilestonesBase
            milestones={milestonesWithNext.slice(0, 2)}
            isOpen={isOpen}
          />
          <CollapsibleContent>
            <MilestonesBase milestones={milestonesWithNext.slice(2)} />
          </CollapsibleContent>
          <CollapsibleTrigger asChild>
            <Button
              className="group mx-auto mt-1 flex w-min justify-between gap-2.5"
              variant="outline"
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
  milestones: MilestoneWithNext[]
  isOpen?: boolean
}) {
  return (
    <div className="relative">
      <div className="ml-10">
        {props.milestones.map((milestone, i) => {
          const Icon =
            milestone.type === 'incident' ? IncidentIcon : MilestoneIcon
          const isLast = i === props.milestones.length - 1

          return (
            <div key={i} className="relative pb-7">
              <div
                className={cn(
                  'absolute left-[-1.445rem] top-3 h-full w-[1.7px] bg-gradient-to-b dark:w-px',
                  milestone.type === 'general' && [
                    'from-green-400 dark:from-green-500',
                    milestone.next?.type === 'general' &&
                      'to-green-400 dark:to-green-500',
                    milestone.next?.type === 'incident' &&
                      'to-red-700 dark:to-red-700',
                  ],
                  milestone.type === 'incident' && [
                    'from-red-700 dark:from-red-700',
                    milestone.next?.type === 'incident' &&
                      'to-red-700 dark:to-red-700',
                    milestone.next?.type === 'general' &&
                      'to-green-400 dark:to-green-500',
                  ],
                )}
              />
              {/* 
                You can not transition gradient in css so we can transition opacity
                To make it work we need to have overlap last line with and then transition opacity to 0 when open
              */}
              {isLast && (
                <div
                  className={cn(
                    'absolute left-[-1.445rem] top-3 h-full w-[1.7px] transition-opacity duration-300 dark:w-px',
                    'bg-gradient-to-b from-transparent to-gray-100 dark:to-zinc-900',
                    props.isOpen === true && 'opacity-0',
                  )}
                />
              )}
              <Icon className="absolute -left-8" />
              <p className="text-lg font-bold leading-none">{milestone.name}</p>
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

type MilestoneWithNext = ReturnType<typeof withNext>[number]
function withNext(milestones: Milestone[]) {
  return milestones.map((milestone, i) => {
    // It's next when you are looking from top to bottom
    const nextMilestone = milestones.at(i + 1)
    return {
      ...milestone,
      next: nextMilestone,
    }
  })
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
