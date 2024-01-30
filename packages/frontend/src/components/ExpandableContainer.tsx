import React, { ReactNode } from 'react'

import { cn } from '../utils/cn'
import { ChevronDownIcon } from './icons'

interface ExpandableContainerProps {
  children: ReactNode
  className?: string
  gradientClassName?: string
}

export function ExpandableContainer(props: ExpandableContainerProps) {
  return (
    <div data-role="expandable-container">
      <div
        data-role="expandable-container-content"
        className={cn(
          'relative overflow-y-hidden transition-max-height duration-300',
          props.className,
          !props.className?.includes('max-h-') && 'max-h-80',
        )}
      >
        <div>{props.children}</div>
        <div
          data-role="expandable-container-content-gradient"
          className={cn(
            'pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white dark:from-neutral-900',
            props.gradientClassName,
          )}
        />
      </div>
      <div
        data-role="expandable-container-button"
        className="mx-auto mt-1 flex w-min cursor-pointer items-center justify-center rounded-md border border-pink-900 px-8 py-2 transition hover:bg-pink-900/25"
      >
        <div className="flex gap-2.5">
          <span
            data-role="expandable-container-button-text"
            className="whitespace-pre text-sm font-bold"
          >
            Show more
          </span>
          <ChevronDownIcon
            data-role="expandable-container-button-arrow"
            className="transition-transform duration-300"
          />
        </div>
      </div>
    </div>
  )
}
