import { RatingCategory, RatingModifier } from '@l2beat/config'
import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

interface RatingBadgeProps {
  category: RatingCategory
  modifier?: RatingModifier
  small?: boolean
}

export function RatingBadge({ category, modifier, small }: RatingBadgeProps) {
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
      {modifier}
    </Badge>
  )
}

function getColorClassName(rating: RatingCategory): string {
  switch (rating) {
    case 'A':
      return 'bg-green-500 text-black'
    case 'B':
      return 'bg-yellow-100 text-black'
    case 'C':
      return 'bg-orange text-black'
    case 'D':
      return 'bg-red-400 text-white'
    case '-':
      return 'bg-red-900 text-white'
  }
}
