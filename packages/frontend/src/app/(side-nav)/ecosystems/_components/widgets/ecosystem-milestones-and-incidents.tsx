'use client'
import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useRef, useState } from 'react'
import {
  getTickCondition,
  getTickFormatter,
} from '~/components/core/chart/utils/get-x-axis-props'
import { CustomLink } from '~/components/link/custom-link'
import { ChevronIcon } from '~/icons/chevron'
import { IncidentIcon } from '~/icons/incident'
import { MilestoneIcon } from '~/icons/milestone'
import { generateTimestamps } from '~/server/features/utils/generate-timestamps'
import { cn } from '~/utils/cn'
import { formatDate } from '~/utils/dates'
import { EcosystemWidget, EcosystemWidgetTitle } from './ecosystem-widget'

export function EcosystemMilestonesAndIncidents({
  milestones,
}: {
  milestones: Milestone[]
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
  const tickCondition = getTickCondition(actualRangeInDays)
  const tickFormatter = getTickFormatter(actualRangeInDays)

  return (
    <EcosystemWidget>
      <div className="grid grid-cols-3 gap-6" ref={sectionRef}>
        <div className="col-span-2 flex flex-col">
          <EcosystemWidgetTitle>Milestones & Incidents</EcosystemWidgetTitle>
          <div className="relative my-auto">
            <div className="h-px w-full bg-gradient-to-r from-[--ecosystem-primary-50] to-[--ecosystem-primary]" />
            <svg
              width="12"
              height="9"
              viewBox="0 0 12 9"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute -right-0.5 -top-1 fill-[--ecosystem-primary]"
            >
              <path d="M12 4.177L-3.93401e-07 8.99996L0 -4.55091e-05L12 4.177Z" />
            </svg>
            {timestamps.map((timestamp, index) => {
              const shouldShow = tickCondition(timestamp)
              if (!shouldShow) return null
              const label = tickFormatter(timestamp)
              return (
                <span
                  key={timestamp}
                  className="absolute top-2.5 text-3xs leading-none text-secondary"
                  style={{ left: `${(index / timestamps.length) * 100}%` }}
                >
                  {label}
                </span>
              )
            })}
            {timestamps.map((timestamp, index) => {
              const milestones = milestonesByTimestamp[timestamp]
              if (!milestones) return null
              return milestones.map((milestone) => {
                const Icon =
                  milestone.type === 'incident' ? IncidentIcon : MilestoneIcon
                const isSelected = milestone.index === selectedMilestoneIndex
                return (
                  <button
                    key={`${timestamp}-${milestone.index}`}
                    onClick={() => setSelectedMilestoneIndex(milestone.index)}
                    className={cn(
                      'absolute -top-2.5',
                      isSelected && 'z-10 scale-150 transition-transform',
                    )}
                    style={{ left: `${(index / timestamps.length) * 100}%` }}
                  >
                    <Icon />
                  </button>
                )
              })
            })}
          </div>
        </div>
        <Details
          milestones={milestones}
          selectedMilestoneIndex={selectedMilestoneIndex}
          setSelectedMilestoneIndex={setSelectedMilestoneIndex}
          className="col-span-1"
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
  milestones: Milestone[]
  selectedMilestoneIndex: number
  setSelectedMilestoneIndex: (index: number) => void
  className?: string
}) {
  const selectedMilestone = milestones[selectedMilestoneIndex]!

  return (
    <div
      className={cn(
        'flex h-40 flex-col justify-between rounded bg-surface-secondary p-4',
        className,
      )}
    >
      <div>
        <span className="text-2xs font-bold uppercase text-[--ecosystem-primary]">
          {formatDate(selectedMilestone.date.slice(0, 10))}
        </span>
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
            <ChevronIcon className="size-2.5 rotate-90 fill-[--ecosystem-primary] group-disabled:opacity-50" />
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
            <ChevronIcon className="size-2.5 -rotate-90 fill-[--ecosystem-primary] group-disabled:opacity-50" />
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

function mapMilestones(milestones: Milestone[]) {
  const milestonesByTimestamp: Record<
    number,
    (Milestone & { index: number })[]
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
