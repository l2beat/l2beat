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
        'inline-block rounded px-1.5 text-center font-medium !leading-none',
        oneSize && 'w-20',
        big ? 'py-0.5 text-base md:text-lg' : 'py-[3px] text-xs',
        value && 'uppercase',
        className,
      )}
    >
      <span className="relative top-[0.5px]">{value ?? 'n/a'}</span>
    </span>
  )
}

function getColorClassName(stage: Stage | 'UnderReview' | undefined): string {
  switch (stage) {
    case 'Stage 2':
      return 'bg-green-800 text-white'
    case 'Stage 1':
      return 'bg-yellow-250 text-black'
    case 'Stage 0':
      return 'bg-orange-400 text-black'
    case 'UnderReview':
      return 'bg-gray-750 text-yellow-200'
    case undefined:
      return 'bg-gray-200 dark:bg-gray-750 text-gray-500 dark:text-gray-400 !font-normal'
    default:
      return ''
  }
}
