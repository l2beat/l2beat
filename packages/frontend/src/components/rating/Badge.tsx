import cx from 'classnames'
import React from 'react'

import { Badge } from '../badge/Badge'

export type RatingCategory = 'A' | 'B' | 'C' | 'D' | '-'
export type RatingModifier = '--' | '-' | '+' | '++'

interface RatingBadgeProps {
  category: RatingCategory
  modifier?: RatingModifier
}

export function RatingBadge({ category, modifier }: RatingBadgeProps) {
  const colorClassName = getColorClassName(category)
  return (
    <Badge
      className={cx(
        colorClassName,
        'text-center text-lg leading-none w-10 inline-block py-0.5',
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
      return 'bg-green-450 text-black'
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