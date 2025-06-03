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
        xmlns="http://www.w3.org/2000/svg"
        className="mb-px fill-secondary"
      >
        <path
          d="M6 0.5C5.87301 0.5 5.74601 0.546907 5.64894 0.640991L1.67675 4.49099C1.53474 4.62863 1.49214 4.83549 1.56911 5.01548C1.64557 5.19547 1.82721 5.3125 2.02781 5.3125H9.97219C10.1728 5.3125 10.3544 5.19547 10.4309 5.01548C10.5079 4.83549 10.4653 4.62863 10.3232 4.49099L6.35106 0.640991C6.25399 0.546907 6.12699 0.5 6 0.5Z"
          className={cn(
            direction === 'asc' && 'fill-primary',
            nextDirection === 'asc' &&
              'group-hover/sorting-arrows:fill-primary group-hover/sorting-arrows:opacity-45 dark:group-hover/sorting-arrows:opacity-75',
          )}
        />
        <path
          d="M2.02781 6.6875C1.82721 6.6875 1.64557 6.80453 1.56911 6.98452C1.49214 7.16451 1.53474 7.37137 1.67675 7.50901L5.64894 11.359C5.74576 11.4529 5.87289 11.5 6 11.5C6.12711 11.5 6.25424 11.4529 6.35106 11.359L10.3232 7.50901C10.4653 7.37137 10.5079 7.16451 10.4309 6.98452C10.3544 6.80453 10.1728 6.6875 9.97219 6.6875H2.02781Z"
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
