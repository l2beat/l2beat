import { type Milestone } from '@l2beat/config'
import React from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import { formatDate } from '~/utils/dates'
import { CustomLink } from '../../link/custom-link'

interface Props {
  milestone: Milestone
}

export function ChartMilestoneHover({ milestone }: Props) {
  const breakpoint = useBreakpoint()
  const isMobile = breakpoint === 'mobile'
  return (
    <div>
      <div className="mb-1 whitespace-nowrap">
        {formatDate(milestone.date.slice(0, 10))}
      </div>
      <div className="mb-2 flex max-w-[216px] flex-wrap font-bold">
        <div className="absolute mt-[2px] size-2.5 rotate-45 border-2 border-green-500 bg-green-700 md:mt-1"></div>
        <span className="ml-4 text-left">{milestone.name}</span>
      </div>
      <div className="mb-1 max-w-[216px] text-left">
        {milestone.description}
      </div>
      {isMobile && <CustomLink href={milestone.link}>Learn more</CustomLink>}
    </div>
  )
}
