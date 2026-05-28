import type { SortDirection } from '@tanstack/react-table'
import type React from 'react'

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
      <svg
        width="12"
        height="12"
        viewBox="0 0 12 12"
       
        className="mb-px fill-secondary"
      >
        <path
          d="M6 .5a.5.5 0 00-.351.141l-3.972 3.85a.47.47 0 00-.108.524c.077.18.258.298.459.298h7.944c.2 0 .382-.118.459-.298a.47.47 0 00-.108-.524L6.351.641A.5.5 0 006 .5"
          className={cn(
            direction === 'asc' && 'fill-primary',
            nextDirection === 'asc' &&
              'group-hover/sorting-arrows:fill-primary group-hover/sorting-arrows:opacity-45 dark:group-hover/sorting-arrows:opacity-75',
          )}
        />
        <path
          d="M2.028 6.688c-.2 0-.382.117-.459.297a.47.47 0 00.108.524l3.972 3.85a.503.503 0 00.702 0l3.972-3.85a.47.47 0 00.108-.524.5.5 0 00-.459-.298z"
          className={cn(
            direction === 'desc' && 'fill-primary',
            nextDirection === 'desc' &&
              'group-hover/sorting-arrows:fill-primary group-hover/sorting-arrows:opacity-45 dark:group-hover/sorting-arrows:opacity-75',
          )}
        />
      </svg>
      {children}
    </div>
  )
}
