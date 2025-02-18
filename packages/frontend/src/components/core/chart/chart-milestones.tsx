'use client'
import type { Milestone } from '@l2beat/config'
import { useEffect, useMemo, useState } from 'react'
import { CustomLink } from '~/components/link/custom-link'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
import { IncidentIcon } from '~/icons/incident'
import { MilestoneIcon } from '~/icons/milestone'
import { formatDate } from '~/utils/dates'
import { DialogTitle } from '../dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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

  return (
    <div data-role="milestones">
      {timestampedMilestones?.map((data, index) => {
        if (!data.milestone) return null
        const x = index / (timestampedMilestones.length - 1)
        return (
          <ChartMilestone
            key={data.milestone.date}
            milestone={data.milestone}
            left={x * width - 10}
          />
        )
      })}
    </div>
  )
}

function ChartMilestone({
  milestone,
  left,
}: {
  milestone: Milestone
  left: number
}) {
  const isMobile = useIsMobile()

  const Icon = milestone.type === 'general' ? MilestoneIcon : IncidentIcon

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Icon
            className="absolute bottom-5 scale-75 cursor-pointer group-has-[.recharts-legend-wrapper]:bottom-9"
            style={{ left }}
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DialogTitle className="flex gap-1.5 font-bold">
              <Icon className="size-[18px] shrink-0" />
              <span>{milestone.title}</span>
            </DialogTitle>
            <DrawerDescription>
              <p className="mb-2 text-xs text-secondary">
                {formatDate(milestone.date.slice(0, 10))}
              </p>
              <p>{milestone.description}</p>
              <CustomLink href={milestone.url}>Learn more</CustomLink>
            </DrawerDescription>
          </DrawerHeader>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          className="absolute bottom-5 group-has-[.recharts-legend-wrapper]:bottom-9"
          href={milestone.url}
          style={{ left }}
          target="_blank"
        >
          <Icon />
        </a>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="mb-1 whitespace-nowrap">
          {formatDate(milestone.date.slice(0, 10))}
        </div>
        <div className="mb-2 flex max-w-[216px] font-bold">
          <Icon className="mt-px size-3.5 shrink-0" />
          <span className="ml-1.5 text-left">{milestone.title}</span>
        </div>
        <div className="mb-1 max-w-[216px] text-left">
          {milestone.description}
        </div>
      </TooltipContent>
    </Tooltip>
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
