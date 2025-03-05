'use client'
import type { Milestone } from '@l2beat/config'
import { assert } from '@l2beat/shared-pure'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/custom-link'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
import { ChevronIcon } from '~/icons/chevron'
import { IncidentIcon } from '~/icons/incident'
import { MilestoneIcon } from '~/icons/milestone'
import { cn } from '~/utils/cn'
import { formatDate } from '~/utils/dates'
import { Button } from '../button'
import { DialogTitle } from '../dialog'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from '../drawer'
import { Tooltip, TooltipContent, TooltipTrigger } from '../tooltip/tooltip'

type TimestampedMilestone = {
  timestamp: number
  milestone: Milestone | undefined
}

interface Props<T extends { timestamp: number }> {
  data: T[] | undefined
  milestones: Milestone[]
  ref: React.RefObject<HTMLDivElement | null>
}

export function ChartMilestones<T extends { timestamp: number }>({
  data,
  milestones,
  ref,
}: Props<T>) {
  const [width, setWidth] = useState<number>()
  const timestampedMilestones = useMemo(
    () => getTimestampedMilestones(data, milestones),
    [data, milestones],
  )

  useEffect(() => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  }, [ref])

  useEventListener('resize', () => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  })

  if (!timestampedMilestones || width === undefined) return null

  const sortedMilestones = [...milestones].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  return (
    <div data-role="milestones">
      {timestampedMilestones?.map((data, index) => {
        if (!data.milestone) return null
        const x = index / (timestampedMilestones.length - 1)
        const milestoneIndex = sortedMilestones.findIndex(
          (m) => m.date === data.milestone?.date,
        )

        return (
          <ChartMilestone
            key={data.milestone.date}
            left={x * width - 10}
            milestoneIndex={milestoneIndex}
            allMilestones={sortedMilestones}
          />
        )
      })}
    </div>
  )
}

function ChartMilestone({
  left,
  milestoneIndex,
  allMilestones,
}: {
  left: number
  milestoneIndex: number
  allMilestones: Milestone[]
}) {
  const isMobile = useIsMobile()
  const triggerMilestone = allMilestones[milestoneIndex]
  assert(triggerMilestone)

  const Icon =
    triggerMilestone.type === 'general' ? MilestoneIcon : IncidentIcon

  const common =
    'absolute bottom-5 group-has-[.recharts-legend-wrapper]:bottom-8'
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Icon className={cn(common, 'scale-75')} style={{ left }} />
        </DrawerTrigger>
        <DrawerContent>
          <MilestoneDrawerContent
            milestoneIndex={milestoneIndex}
            allMilestones={allMilestones}
          />
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          className={common}
          href={triggerMilestone.url}
          style={{ left }}
          target="_blank"
        >
          <Icon />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="mb-1 whitespace-nowrap">
          {formatDate(triggerMilestone.date.slice(0, 10))}
        </div>
        <div className="mb-2 flex max-w-[216px] font-bold">
          <Icon className="mt-px size-3.5 shrink-0" />
          <span className="ml-1.5 text-left">{triggerMilestone.title}</span>
        </div>
        <div className="mb-1 max-w-[216px] text-left">
          {triggerMilestone.description}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

function MilestoneDrawerContent({
  milestoneIndex,
  allMilestones,
}: {
  milestoneIndex: number
  allMilestones: Milestone[]
}) {
  const [selectedMilestoneIndex, setSelectedMilestoneIndex] = useState<number>(milestoneIndex)
  const tooltipMilestone = allMilestones[openedMilestone]
  assert(tooltipMilestone)

  const Icon =
    tooltipMilestone.type === 'general' ? MilestoneIcon : IncidentIcon

  return (
    <>
      <DrawerHeader>
        <DialogTitle className="flex gap-1.5 font-bold">
          <Icon className="size-[18px] shrink-0" />
          <span>{tooltipMilestone.title}</span>
        </DialogTitle>
        <p className="mb-4 ml-6 text-xs text-secondary">
          {formatDate(tooltipMilestone.date.slice(0, 10))}
        </p>
        <p className="mb-2 text-sm leading-[140%]">
          {tooltipMilestone.description}
        </p>
        <CustomLink href={tooltipMilestone.url}>Learn more</CustomLink>
      </DrawerHeader>
      <DrawerFooter className="flex flex-row items-center justify-between px-0 pb-8 pt-6">
        <Button
          size="sm"
          className="h-10 w-[120px] bg-brand px-3 text-sm text-primary-invert disabled:bg-brand/40"
          onClick={() => setOpenedMilestone((s) => s - 1)}
          aria-label="Previous milestone"
          disabled={openedMilestone === 0}
        >
          <ChevronIcon className="mr-1 size-3 rotate-90" />
          Previous
        </Button>
        <div className="text-[13px] text-secondary">
          {openedMilestone + 1} of {allMilestones.length}
        </div>
        <Button
          size="sm"
          className="h-10 w-[120px] bg-brand px-3 text-sm text-primary-invert disabled:bg-brand/40"
          onClick={() => setOpenedMilestone((s) => s + 1)}
          aria-label="Next milestone"
          disabled={openedMilestone === allMilestones.length - 1}
        >
          Next
          <ChevronIcon className="ml-1 size-3 -rotate-90" />
        </Button>
      </DrawerFooter>
    </>
  )
}

function getTimestampedMilestones<T extends { timestamp: number }>(
  data: T[] | undefined,
  milestones: Milestone[],
): TimestampedMilestone[] {
  const mappedMilestones = mapMilestones(milestones)
  return (
    data?.map((point) => ({
      timestamp: point.timestamp,
      milestone: mappedMilestones[point.timestamp],
    })) ?? []
  )
}

function mapMilestones(milestones: Milestone[]): Record<number, Milestone> {
  const result: Record<number, Milestone> = {}
  for (const milestone of milestones) {
    const timestamp = Math.floor(new Date(milestone.date).getTime() / 1000)
    result[timestamp] = milestone
  }
  return result
}
