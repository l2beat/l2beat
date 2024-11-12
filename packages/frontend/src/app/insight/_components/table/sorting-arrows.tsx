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
      className="group/sorting-arrows flex w-max cursor-pointer select-none items-end gap-1.5"
      onClick={onClick}
    >
      <div className="mb-px flex scale-90 flex-col items-end gap-0.5">
        <SortingArrowIcon
          width={10}
          height={6}
          className={cn(
            'fill-[#74749F] transition-all',
            direction === 'asc' && 'fill-[#666694]',
            nextDirection === 'asc' &&
              'group-hover/sorting-arrows:fill-[#666694] group-hover/sorting-arrows:opacity-70',
          )}
        />
        <SortingArrowIcon
          width={10}
          height={6}
          className={cn(
            'rotate-180 fill-[#74749F] transition-all',
            direction === 'desc' && 'fill-[#666694]',
            nextDirection === 'desc' &&
              'group-hover/sorting-arrows:fill-[#666694] group-hover/sorting-arrows:opacity-70',
          )}
        />
      </div>
      {children}
    </div>
  )
}
