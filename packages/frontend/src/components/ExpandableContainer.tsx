import classNames from 'classnames'
import React, { ReactNode } from 'react'

import { ChevronDownIcon } from './icons'

interface ExpandableContainerProps {
  children: ReactNode
  className?: string
}

export function ExpandableContainer(props: ExpandableContainerProps) {
  return (
    <div className="ExpandableContainer">
      <div
        className={classNames(
          'ExpandableContainerContent relative overflow-y-hidden transition-max-height duration-300',
          props.className,
          !props.className?.includes('max-h-') && 'max-h-80',
        )}
      >
        <div>{props.children}</div>
        <div className="ExpandableContainerContentGradient pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-b from-transparent to-white dark:to-black " />
      </div>
      <div className="ExpandableContainerButton mx-auto mt-1 flex w-min cursor-pointer items-center justify-center rounded-md border border-pink-900 px-8 py-2 transition hover:bg-pink-900 hover:bg-opacity-25">
        <div className="flex gap-2.5">
          <span className="ExpandableContainerButtonText whitespace-pre text-sm font-bold">
            Show more
          </span>
          <ChevronDownIcon className="ExpandableContainerButtonArrow transition-transform duration-300" />
        </div>
      </div>
    </div>
  )
}
