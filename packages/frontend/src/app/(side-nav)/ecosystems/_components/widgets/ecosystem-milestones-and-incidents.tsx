'use client'
import { assert, UnixTime } from '@l2beat/shared-pure'
import { useRef, useState } from 'react'
import { MilestoneDrawerContent } from '~/components/core/chart/chart-milestones'
import {
  getTickCondition,
  getTickFormatter,
} from '~/components/core/chart/utils/get-x-axis-props'
import { Drawer, DrawerContent, DrawerTrigger } from '~/components/core/drawer'
import { CustomLink } from '~/components/link/custom-link'
import { useBreakpoint } from '~/hooks/use-breakpoint'
import { ChevronIcon } from '~/icons/chevron'
import { IncidentIcon } from '~/icons/incident'
import { MilestoneIcon } from '~/icons/milestone'
import type { EcosystemMilestone } from '~/server/features/ecosystems/get-ecosystem-entry'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { cn } from '~/utils/cn'
import { formatDate } from '~/utils/dates'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemMilestonesAndIncidents({
  milestones,
  className,
}: {
  milestones: EcosystemMilestone[]
  className?: string
}) {
  const sectionRef = useRef<HTMLDivElement>(null)

  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(
    milestones.length - 1,
  )
  const milestonesByTimestamp = mapMilestones(milestones)
  const milestonesTimestamps = Object.keys(milestonesByTimestamp).map(Number)

  // add 60 days offset to make the timeline look better
  const minTimestamp = Math.min(...milestonesTimestamps) - 60 * UnixTime.DAY
  const maxTimestamp = Math.max(...milestonesTimestamps) + 90 * UnixTime.DAY

  const actualRangeInDays =
    (UnixTime.toStartOf(maxTimestamp, 'day') -
      UnixTime.toStartOf(minTimestamp, 'day')) /
    UnixTime.DAY

  const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')

  return (
    <EcosystemWidget className={className}>
      <div className="grid grid-cols-3 gap-6" ref={sectionRef}>
        <div className="col-span-full flex flex-col lg:col-span-2">
          <EcosystemWidgetTitle>Milestones & Incidents</EcosystemWidgetTitle>
          <div className="my-auto">
            <div className="relative mt-2 h-5">
              <div className="h-px w-full bg-secondary" />
              <svg
                width="12"
                height="9"
                viewBox="0 0 12 9"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="absolute -right-0.5 -top-1 fill-secondary"
              >
                <path d="M12 4.177L-3.93401e-07 8.99996L0 -4.55091e-05L12 4.177Z" />
              </svg>
              <Timeline
                timestamps={timestamps}
                actualRangeInDays={actualRangeInDays}
              />
              {timestamps.map((timestamp, index) => {
                const milestonesForTimestamp = milestonesByTimestamp[timestamp]
                if (!milestonesForTimestamp) return null
                return milestonesForTimestamp.map((milestone) => (
                  <MilestoneItem
                    key={`${timestamp}-${milestone.index}`}
                    onClick={() => setSelectedMilestoneIndex(milestone.index)}
                    milestone={milestone}
                    allMilestones={milestones}
                    selectedMilestoneIndex={selectedMilestoneIndex}
                    style={{ left: `${(index / timestamps.length) * 100}%` }}
                  />
                ))
              })}
            </div>
          </div>
        </div>
        <Details
          milestones={milestones}
          selectedMilestoneIndex={selectedMilestoneIndex}
          setSelectedMilestoneIndex={setSelectedMilestoneIndex}
          className="col-span-1 max-lg:hidden"
        />
      </div>
    </EcosystemWidget>
  )
}

function Details({
  milestones,
  selectedMilestoneIndex,
  setSelectedMilestoneIndex,
  className,
}: {
  milestones: EcosystemMilestone[]
  selectedMilestoneIndex: number
  setSelectedMilestoneIndex: (index: number) => void
  className?: string
}) {
  const selectedMilestone = milestones[selectedMilestoneIndex]
  assert(selectedMilestone, 'No selected milestone')

  return (
    <div
      className={cn(
        'flex h-40 flex-col justify-between rounded bg-surface-secondary p-4',
        className,
      )}
    >
      <div>
        <p className="text-2xs font-bold uppercase text-secondary">
          {formatDate(selectedMilestone.date.slice(0, 10))} •{' '}
          {selectedMilestone.projectName}
        </p>
        <p className="text-base font-bold leading-tight">
          {selectedMilestone.title}
        </p>
        <p className="text-xs leading-tight text-secondary">
          {selectedMilestone.description}
        </p>
      </div>
      <div className="flex items-end justify-between">
        <div className="-ml-1 flex items-center">
          <button
            disabled={selectedMilestoneIndex === 0}
            className="group p-1"
            onClick={() =>
              setSelectedMilestoneIndex(selectedMilestoneIndex - 1)
            }
          >
            <ChevronIcon className="size-2.5 rotate-90 fill-primary group-disabled:opacity-50" />
          </button>
          <span className="relative top-px text-3xs font-medium leading-none text-secondary">
            {selectedMilestoneIndex + 1} of {milestones.length}
          </span>
          <button
            className="group p-1"
            disabled={selectedMilestoneIndex === milestones.length - 1}
            onClick={() =>
              setSelectedMilestoneIndex(selectedMilestoneIndex + 1)
            }
          >
            <ChevronIcon className="size-2.5 -rotate-90 fill-primary group-disabled:opacity-50" />
          </button>
        </div>
        <CustomLink
          href={selectedMilestone.url}
          className="-mr-1 p-1 text-3xs font-medium leading-none"
        >
          Learn more
        </CustomLink>
      </div>
    </div>
  )
}

function MilestoneItem({
  onClick,
  milestone,
  selectedMilestoneIndex,
  allMilestones,
  style,
}: {
  onClick: () => void
  milestone: EcosystemMilestone & { index: number }
  allMilestones: EcosystemMilestone[]
  selectedMilestoneIndex: number
  style: React.CSSProperties
}) {
  const breakpoint = useBreakpoint()
  const Icon = milestone.type === 'incident' ? IncidentIcon : MilestoneIcon
  const isSelected = milestone.index === selectedMilestoneIndex

  if (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md') {
    return (
      <Drawer>
        <DrawerTrigger className="absolute -top-2.5" style={style}>
          <Icon />
        </DrawerTrigger>
        <DrawerContent>
          <MilestoneDrawerContent
            milestoneIndex={milestone.index}
            allMilestones={allMilestones}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <button
      onClick={onClick}
      className={cn(
        'absolute -top-2.5 scale-75 lg:scale-100',
        isSelected &&
          'z-10 scale-100 transition-transform duration-200 ease-in-out lg:scale-150',
      )}
      style={style}
    >
      <Icon />
    </button>
  )
}

function Timeline({
  timestamps,
  actualRangeInDays,
}: {
  timestamps: number[]
  actualRangeInDays: number
}) {
  const tickCondition = getTickCondition(actualRangeInDays)
  const tickFormatter = getTickFormatter(actualRangeInDays)
  return timestamps.map((timestamp, index) => {
    const shouldShow = tickCondition(timestamp)
    if (!shouldShow) return null
    const label = tickFormatter(timestamp)
    return (
      <span
        key={timestamp}
        className="absolute top-2.5 whitespace-nowrap text-3xs leading-none text-secondary"
        style={{ left: `${(index / timestamps.length) * 100}%` }}
      >
        {label}
      </span>
    )
  })
}

function mapMilestones(milestones: EcosystemMilestone[]) {
  const milestonesByTimestamp: Record<
    number,
    (EcosystemMilestone & { index: number })[]
  > = {}
  for (const [index, milestone] of milestones.entries()) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    const milestoneWithIndex = {
      ...milestone,
      index,
    }
    if (!milestonesByTimestamp[timestamp]) {
      milestonesByTimestamp[timestamp] = []
    }
    milestonesByTimestamp[timestamp].push(milestoneWithIndex)
  }
  return milestonesByTimestamp
}
