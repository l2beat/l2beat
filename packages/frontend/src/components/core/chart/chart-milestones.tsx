'use client'
import type { Milestone } from '@l2beat/config'
import { useEffect, useState } from 'react'
import { CustomLink } from '~/components/link/custom-link'
import { useIsMobile } from '~/hooks/use-breakpoint'
import { useEventListener } from '~/hooks/use-event-listener'
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

export function ChartMilestones<
  T extends { milestone: Milestone | undefined },
>({
  chartData,
  ref,
}: {
  chartData: T[] | undefined
  ref: React.RefObject<HTMLDivElement | null>
}) {
  const [width, setWidth] = useState<number>()

  useEffect(() => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  }, [ref])

  useEventListener('resize', () => {
    if (!ref.current) return
    setWidth(ref.current.getBoundingClientRect().width)
  })

  if (!chartData || width === undefined) return null

  return (
    <div data-role="milestones">
      {chartData?.map((data, index) => {
        if (!data.milestone) return null
        const x = index / (chartData.length - 1)
        return (
          <ChartMilestone
            key={data.milestone.date}
            milestone={data.milestone}
            left={x * (width - 10)}
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

  const icon = (
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      role="img"
      aria-label="Milestone icon"
      className="absolute bottom-5 cursor-pointer fill-green-700 stroke-green-500 hover:stroke-green-400 group-has-[.recharts-legend-wrapper]:bottom-9"
      style={{ left }}
    >
      <rect
        x="9.89941"
        y="1.41421"
        width="12"
        height="12"
        rx="1"
        transform="rotate(45 9.89941 1.41421)"
        strokeWidth="2"
      ></rect>
    </svg>
  )

  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>{icon}</DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DialogTitle className="flex items-center font-bold">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                role="img"
                aria-label="Milestone icon"
                className="mr-1.5 fill-green-700 stroke-green-500"
              >
                <rect
                  x="9.89941"
                  y="1.41421"
                  width="12"
                  height="12"
                  rx="1"
                  transform="rotate(45 9.89941 1.41421)"
                  strokeWidth="2"
                ></rect>
              </svg>
              {milestone.title}
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
      <TooltipTrigger asChild>{icon}</TooltipTrigger>
      <TooltipContent side="top">
        <ChartMilestoneHover milestone={milestone} />
      </TooltipContent>
    </Tooltip>
  )
}

interface Props {
  milestone: Milestone
}

function ChartMilestoneHover({ milestone }: Props) {
  const isMobile = useIsMobile()
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatDate(milestone.date.slice(0, 10))}
      </div>
      <div className="mb-2 flex max-w-[216px] flex-wrap font-bold">
        {milestone.type === 'incident' ? (
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="absolute mt-[2px] fill-red-800 stroke-red-700 md:mt-1"
            role="img"
          >
            <path
              d="M2.11842 14.4966L9.13637 2.46527C9.52224 1.80374 10.4781 1.80375 10.864 2.46528L17.882 14.497C18.2708 15.1637 17.7899 16.0008 17.0182 16.0008L10.0003 16.0008L10.0002 16.0008L2.98214 16.0004C2.21039 16.0004 1.72956 15.1632 2.11842 14.4966Z"
              strokeWidth="2"
            />
          </svg>
        ) : (
          <div className="absolute mt-[2px] size-2.5 rotate-45 border-2 border-green-500 bg-green-700 md:mt-1"></div>
        )}
        <span className="ml-4 text-left">{milestone.title}</span>
      </div>
      <div className="mb-1 max-w-[216px] text-left">
        {milestone.description}
      </div>
      {isMobile && <CustomLink href={milestone.url}>Learn more</CustomLink>}
    </div>
  )
}
