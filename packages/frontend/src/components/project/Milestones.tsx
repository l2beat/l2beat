import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ArrowRightIcon } from '../icons'
import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'
import { OutLink } from '../OutLink'

export interface MilestonesProps {
  milestones?: Milestone[]
  className?: string
}

export function Milestones({ milestones, className }: MilestonesProps) {
  if (milestones === undefined) {
    return null
  }

  return (
    <div className={cx('px-4 md:px-0', className)}>
      <p className="text-[28px] leading-[32px] font-bold">Milestones</p>
      <div className="h-auto relative">
        <div className="absolute left-[15.4px] h-[100%] mt-2">
          <div className="h-[60%] w-[1.7px] dark:w-px bg-green-400 dark:bg-green-500 " />
          <div className="h-[40%] w-[1.7px] dark:w-px bg-gradient-to-b from-green-400 dark:from-green-500" />
        </div>
        <div className="ml-10 mt-6">
          {milestones
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((milestone, i) => (
              <div key={i} className="pb-7">
                <MilestoneIcon className="absolute left-1.5" />
                <p className="font-bold text-lg leading-none">
                  {milestone.name}
                </p>
                <p className="dark:text-gray-400 text-sm">
                  {formatDate(milestone.date)}
                </p>
                <div className="mt-3">
                  {milestone.description && (
                    <p className="dark:text-gray-400 text-sm leading-none">
                      {milestone.description}
                    </p>
                  )}
                  <OutLink
                    className="text-sm underline font-bold text-link flex flex-wrap items-center gap-1"
                    href={milestone.link}
                  >
                    Learn more
                    <ArrowRightIcon className="fill-link" />
                  </OutLink>
                </div>
              </div>
            ))}
        </div>
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
