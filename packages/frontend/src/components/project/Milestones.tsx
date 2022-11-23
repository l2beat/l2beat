import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { MilestoneIcon } from '../icons/symbols/MilestoneIcon'

export interface MilestonesProps {
  milestones: Milestone[]
  className?: string
}

export function Milestones({ milestones, className }: MilestonesProps) {
  return (
    <div className={cx('relative', className)}>
      <div className="mb-6">
        <span className="text-2xl font-bold">Project Milestones</span>
      </div>
      <div className="absolute left-[15.4px] h-[100%]">
        <div className="h-[70%] w-[1px] bg-green-500 mt-1" />
        <div className="h-[30%] w-[1px] bg-gradient-to-b from-green-500 to-black" />
      </div>
      <div className="relative">
        <MilestoneIcon className="fill-green-800 stroke-green-500 absolute left-[6px]" />
        {/* <div>Title</div> */}
        {/* <div>Date</div> */}
        {/* <div>Description</div> */}
      </div>
    </div>
  )
}
