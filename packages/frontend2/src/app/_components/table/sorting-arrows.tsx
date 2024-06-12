import { type SortDirection } from '@tanstack/react-table'
import React from 'react'

import SortingArrowIcon from '~/icons/sorting-arrow.svg'
import { cn } from '~/utils/cn'

interface Props {
  sortDirection: false | SortDirection
  nextSortDirection: false | SortDirection
  children: React.ReactNode
}

export function SortingArrows({
  children,
  sortDirection,
  nextSortDirection,
}: Props) {
  return (
    <div className="group/sorting-arrows cursor-pointer select-none flex items-center gap-1.5">
      <div className="flex flex-col items-end gap-0.5">
        <SortingArrowIcon
          width={10}
          height={6}
          className={cn(
            'fill-gray-550 transition-all dark:fill-gray-650',
            sortDirection === 'asc' && 'fill-black dark:fill-white',
            nextSortDirection === 'asc' &&
              'group-hover/sorting-arrows:fill-black group-hover/sorting-arrows:opacity-70 dark:group-hover/sorting-arrows:fill-white dark:group-hover/sorting-arrows:opacity-60',
          )}
        />
        <SortingArrowIcon
          width={10}
          height={6}
          className={cn(
            'rotate-180 fill-gray-550 transition-all dark:fill-gray-650',
            sortDirection === 'desc' && 'fill-black dark:fill-white',
            nextSortDirection === 'desc' &&
              'group-hover/sorting-arrows:fill-black group-hover/sorting-arrows:opacity-70 dark:group-hover/sorting-arrows:fill-white dark:group-hover/sorting-arrows:opacity-60',
          )}
        />
      </div>
      {children}
    </div>
  )
}
