import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

interface StageBadgeProps {
  stage: string | undefined
  small?: boolean
}

export function StageBadge({ stage, small }: StageBadgeProps) {
  return (
    <Badge
      className={cx(
        getColorClassName(stage),
        'inline-block text-center  leading-none',
        small ? 'w-15 text-base' : 'w-40  text-lg',
      )}
      oneSize
    >
      {stage ?? '-'}
    </Badge>
  )
}

function getColorClassName(stage: string | undefined): string {
  switch (stage) {
    case 'Stage 2':
      return 'bg-green-500 text-black'
    case 'Stage 1':
      return 'bg-yellow-100 text-black'
    case 'Stage 0':
      return 'bg-orange-500 text-black'
    case undefined:
      return 'bg-red-900 text-white'
    default:
      return ''
  }
}
