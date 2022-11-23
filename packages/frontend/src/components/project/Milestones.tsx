import { Milestone } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

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
      <div className="absolute left-4 h-[100%]">
        <div className="h-[70%] w-[1px] bg-green-500 " />
        <div className="h-[30%] w-[1px] bg-gradient-to-b from-green-500 to-black" />
      </div>
    </div>
  )
}