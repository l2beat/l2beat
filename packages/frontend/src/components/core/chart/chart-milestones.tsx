'use client'
import type { Milestone } from '@l2beat/config'
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
  DrawerDescription,
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
  const [openedMilestoneIndex, setOpenedMilestoneIndex] = useState<
    number | null
  >(null)

  useEffect(() => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  }, [ref])

  useEventListener('resize', () => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  })

  if (!timestampedMilestones || width === undefined) return null

  const validMilestones = timestampedMilestones.filter((data) => data.milestone)

  return (
    <div data-role="milestones">
      {timestampedMilestones?.map((data, index) => {
        if (!data.milestone) return null
        const x = index / (timestampedMilestones.length - 1)
        const milestoneIndex = validMilestones.findIndex(
          (m) => m.milestone?.date === data.milestone?.date,
        )

        return (
          <ChartMilestone
            key={data.milestone.date}
            milestone={data.milestone}
            left={x * width - 10}
            milestoneIndex={milestoneIndex}
            totalMilestones={validMilestones.length}
            setOpenedMilestoneIndex={setOpenedMilestoneIndex}
            openedMilestoneIndex={openedMilestoneIndex}
          />
        )
      })}
    </div>
  )
}

function ChartMilestone({
  milestone,
  left,
  milestoneIndex,
  totalMilestones,
  setOpenedMilestoneIndex,
  openedMilestoneIndex,
}: {
  milestone: Milestone
  left: number
  milestoneIndex: number
  totalMilestones: number
  setOpenedMilestoneIndex: (a: number | null) => void
  openedMilestoneIndex: number | null
}) {
  const isMobile = useIsMobile()

  const Icon = milestone.type === 'general' ? MilestoneIcon : IncidentIcon
  const common =
    'absolute bottom-5 group-has-[.recharts-legend-wrapper]:bottom-8'
  if (isMobile) {
    return (
      <Drawer
        open={openedMilestoneIndex === milestoneIndex}
        onOpenChange={(isOpen) => {
          if (isOpen) {
            setOpenedMilestoneIndex(milestoneIndex)
          } else if (openedMilestoneIndex === milestoneIndex) {
            setOpenedMilestoneIndex(null)
          }
        }}
      >
        <DrawerTrigger asChild>
          <Icon className={cn(common, 'scale-75')} style={{ left }} />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DialogTitle className="flex gap-1.5 font-bold">
              <Icon className="size-[18px] shrink-0" />
              <span>{milestone.title}</span>
            </DialogTitle>
            <DrawerDescription>
              <p className="mb-4 ml-6 text-xs text-secondary">
                {formatDate(milestone.date.slice(0, 10))}
              </p>
              <p className="mb-2 leading-[140%]">{milestone.description}</p>
              <CustomLink href={milestone.url}>Learn more</CustomLink>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter className="flex flex-row items-center justify-between px-0 py-6">
            <Button
              size="sm"
              className="h-12 w-[120px] bg-brand px-3 text-sm text-primary-invert disabled:bg-brand/40"
              onClick={() => setOpenedMilestoneIndex(milestoneIndex - 1)}
              aria-label="Previous milestone"
              disabled={milestoneIndex === 0}
            >
              <ChevronIcon className="mr-1 size-3 rotate-90" />
              Previous
            </Button>
            <div className="text-[13px] text-secondary">
              {milestoneIndex + 1} of {totalMilestones}
            </div>
            <Button
              size="sm"
              className="h-12 w-[120px] bg-brand px-3 text-sm text-primary-invert disabled:bg-brand/40"
              onClick={() => setOpenedMilestoneIndex(milestoneIndex + 1)}
              aria-label="Next milestone"
              disabled={milestoneIndex === totalMilestones - 1}
            >
              Next
              <ChevronIcon className="ml-1 size-3 -rotate-90" />
            </Button>
          </DrawerFooter>
          <DrawerTrigger className="w-full border-t border-divider py-6 text-center text-sm font-medium leading-[170%] text-secondary underline">
            Close
          </DrawerTrigger>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <a
          className={common}
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
