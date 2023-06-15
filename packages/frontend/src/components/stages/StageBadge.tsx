import { Stage } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

export interface StageBadgeProps {
  stage: Stage | 'UnderReview' | undefined
  oneSize?: boolean
  big?: boolean
  className?: string
}

export function StageBadge({
  stage,
  oneSize,
  big,
  className,
}: StageBadgeProps) {
  const value = stage === 'UnderReview' ? 'In review' : stage
  return (
    <span
      className={cx(
        getColorClassName(stage),
        'inline-block rounded  px-1.5 text-center font-medium uppercase leading-none',
        oneSize && 'w-20',
        big ? 'text-md py-0.5' : 'py-[3px] text-xs',
        className,
      )}
    >
      {value ?? '-'}
    </span>
  )
}

function getColorClassName(stage: Stage | 'UnderReview' | undefined): string {
  switch (stage) {
    case 'Stage 2':
      return 'bg-green-200 dark:bg-green-800'
    case 'Stage 1':
      return 'bg-yellow-250 text-black'
    case 'Stage 0':
      return 'bg-orange-400 text-black'
    case 'UnderReview':
      return 'bg-gray-200 dark:bg-gray-750  text-yellow-700 dark:text-yellow-200'
    case undefined:
      return 'bg-gray-200 dark:bg-gray-750'
    default:
      return ''
  }
}
