import { Layer2Maturity, MaturityStage } from '@l2beat/config'
import { assertUnreachable } from '@l2beat/shared'
import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

interface MaturityBadgeProps {
  maturity?: Layer2Maturity
}

export function MaturityBadge({ maturity }: MaturityBadgeProps) {
  return (
    <Badge
      className={cx(
        getColorClassName(maturity?.stage),
        'inline-block w-[70px] whitespace-nowrap py-1 text-center text-sm uppercase leading-none',
      )}
      oneSize
    >
      {maturity?.stage ?? '-'}
    </Badge>
  )
}

function getColorClassName(stage?: MaturityStage): string {
  switch (stage) {
    case 'Stage 0':
      return 'bg-orange-400 text-black'
    case 'Stage 1':
      return 'bg-yellow-250 text-black'
    case 'Stage 2':
      return 'bg-green-800 text-white'
    case undefined:
      return 'bg-gray-100 dark:bg-gray-750'
    default:
      assertUnreachable(stage)
  }
}
