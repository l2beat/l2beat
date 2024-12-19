import { type SortDirection } from '@tanstack/react-table'
import React from 'react'

import { SortingArrowIcon } from '~/icons/sorting-arrow'
import { cn } from '~/utils/cn'

interface Props {
  onClick?: (event: unknown) => void
  direction: false | SortDirection
  nextDirection: false | SortDirection
  children: React.ReactNode
}

export function SortingArrows({
  children,
  direction,
  nextDirection,
  onClick,
}: Props) {
  return (
    <div
      className="group/sorting-arrows flex w-max cursor-pointer select-none items-end gap-1"
      onClick={onClick}
    >
      <div className="mb-0.5 flex flex-col items-end gap-px">
        <SortingArrowIcon
          height={4.5}
          className={cn(
            'fill-gray-550 transition-all dark:fill-gray-650',
            direction === 'asc' && 'fill-black dark:fill-white',
            nextDirection === 'asc' &&
              'group-hover/sorting-arrows:fill-black group-hover/sorting-arrows:opacity-70 dark:group-hover/sorting-arrows:fill-white dark:group-hover/sorting-arrows:opacity-60',
          )}
        />
        <SortingArrowIcon
          height={4.5}
          className={cn(
            'rotate-180 fill-gray-550 transition-all dark:fill-gray-650',
            direction === 'desc' && 'fill-black dark:fill-white',
            nextDirection === 'desc' &&
              'group-hover/sorting-arrows:fill-black group-hover/sorting-arrows:opacity-70 dark:group-hover/sorting-arrows:fill-white dark:group-hover/sorting-arrows:opacity-60',
          )}
        />
      </div>
      {children}
    </div>
  )
}
