import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { ArrowRightIcon } from '../icons/Arrows'
import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'
import { OutLink } from '../OutLink'

export interface MilestonesProps {
  milestones: Milestone[]
  className?: string
}

export function Milestones({ milestones, className }: MilestonesProps) {
  return (
    <div className={cx('relative', className)}>
      <div>
        <span className="text-2xl font-bold">Milestones</span>
      </div>
      <div>
        <div className="absolute left-[15.4px] h-[100%] mt-2">
          <div className="h-[60%] w-[1.7px] dark:w-px bg-green-400 dark:bg-green-500 " />
          <div className="h-[35%] w-[1.7px] dark:w-px bg-gradient-to-b from-green-400 dark:from-green-500" />
        </div>
        <div className="ml-10 mt-4">
          {milestones.map((milestone) => (
            <div className="mb-7">
              <MilestoneIcon className="absolute left-1.5 fill-green-200 stroke-green-400 dark:fill-green-800 dark:stroke-green-500" />
              <div className="font-bold text-lg leading-none">
                {milestone.name}
              </div>
              <div className="dark:text-gray-400 text-sm">
                {formatDate(milestone.date)}
              </div>
              <div className="mt-3">
                {milestone.description && (
                  <div className="dark:text-gray-400 text-sm leading-none">
                    {milestone.description}
                  </div>
                )}
                <div>
                  <OutLink
                    className="text-sm underline font-bold dark:text-blue-475 text-purple-900"
                    href={milestone.link}
                  >
                    <div className="flex flex-wrap">
                      Learn more{' '}
                      <ArrowRightIcon
                        className="dark:fill-blue-475 fill-purple-900"
                        transform="translate(4,3.2)"
                      />
                    </div>
                  </OutLink>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function formatDate(date: Date): string {
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
