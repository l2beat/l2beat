'use client'
import type { Milestone } from '@l2beat/config'
import { UnixTime } from '@l2beat/shared-pure'
import { useRef, useState } from 'react'
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
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(
    milestones.length - 1,
  )
  const milestonesRef = useRef<HTMLDivElement>(null)
  const milestonesByTimestamp = mapMilestones(milestones)
  const milestonesTimestamps = Object.keys(milestonesByTimestamp).map(Number)

  // add 30 days offset to make the timeline look better
  const minTimestamp = Math.min(...milestonesTimestamps) - 60 * UnixTime.DAY
  const maxTimestamp = Math.max(...milestonesTimestamps) + 60 * UnixTime.DAY

  const timestamps = generateTimestamps([minTimestamp, maxTimestamp], 'daily')
  const selectedMilestone = milestones[selectedMilestoneIndex]!
  return (
    <EcosystemWidget>
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 flex flex-col">
          <EcosystemWidgetTitle>Milestones & Incidents</EcosystemWidgetTitle>
          <div className="my-auto">
            <div className="relative">
              <div className="h-px w-full bg-primary" ref={milestonesRef}></div>
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
                        'absolute top-[-9px]',
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
        </div>
        <div className="col-span-1 flex h-40 flex-col justify-between rounded  bg-surface-secondary p-4">
          <div>
            <span className="text-2xs font-bold uppercase text-brand">
              {formatDate(selectedMilestone.date.slice(0, 10))}
            </span>
            <p className="text-base font-bold leading-tight">
              {selectedMilestone.title}
            </p>
            <p className="text-xs leading-tight text-secondary">
              {selectedMilestone.description}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <button
              disabled={selectedMilestoneIndex === 0}
              className="group"
              onClick={() =>
                setSelectedMilestoneIndex(selectedMilestoneIndex - 1)
              }
            >
              <ChevronIcon className="size-2.5 rotate-90 fill-brand group-disabled:opacity-50" />
            </button>
            <span className="relative top-px text-3xs font-medium leading-none text-secondary">
              {selectedMilestoneIndex + 1} of {milestones.length}
            </span>
            <button
              className="group"
              disabled={selectedMilestoneIndex === milestones.length - 1}
              onClick={() =>
                setSelectedMilestoneIndex(selectedMilestoneIndex + 1)
              }
            >
              <ChevronIcon className="size-2.5 -rotate-90 fill-brand group-disabled:opacity-50" />
            </button>
          </div>
        </div>
      </div>
    </EcosystemWidget>
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
