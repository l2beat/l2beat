import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

interface MaturityBadgeProps {
  category: string | undefined
  small?: boolean
}

export function MaturityBadge({ category, small }: MaturityBadgeProps) {
  return (
    <Badge
      className={cx(
        getColorClassName(category),
        'inline-block py-0.5 text-center text-lg leading-none',
        small ? 'w-9' : 'w-10',
      )}
      oneSize
    >
      {category}
    </Badge>
  )
}

function getColorClassName(maturity: string | undefined): string {
  switch (maturity) {
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
