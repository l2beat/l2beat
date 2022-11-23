import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'
import { OutLink } from '../OutLink'

export interface MilestonesProps {
  milestones: Milestone[]
  className?: string
}

//TODO: light mode
//TODO: date format
//TODO: link arrow
export function Milestones({ milestones, className }: MilestonesProps) {
  return (
    <div className={cx('relative', className)}>
      <div>
        <span className="text-2xl font-bold">Project Milestones</span>
      </div>
      <div>
        <div className="absolute left-[15.4px] h-[100%] mt-2">
          <div className="h-[70%] w-[1px] bg-green-500 " />
          <div className="h-[30%] w-[1px] bg-gradient-to-b from-green-500 to-black" />
        </div>
        <div className="ml-10">
          {milestones.map((milestone) => (
            <div className="my-8">
              <MilestoneIcon className=" absolute left-[6px] fill-green-800 stroke-green-500 mt-1 " />
              <div className="font-bold text-lg">{milestone.name}</div>
              <div className="dark:text-gray-400 text-sm">
                {milestone.date.toDateString()}
              </div>
              {milestone.description && (
                <div className="dark:text-gray-400 text-sm mt-4">
                  {milestone.description}
                </div>
              )}
              <div>
                <OutLink className="text-sm text-link underline" href={milestone.link}>
                  Learn more
                </OutLink>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
