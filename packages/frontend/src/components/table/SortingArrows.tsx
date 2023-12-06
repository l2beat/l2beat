import isArray from 'lodash/isArray'
import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '../icons'

interface Props {
  children?: React.ReactNode
  name: string
  sortingOrder: string[] | Record<string, string[]>
}

export function SortingArrows(props: Props) {
  const name = props.name
    .split(' ')
    .join('-')
    .split('\n')
    .join('-')
    .toLowerCase()
  return (
    <div
      className="group/sorting-arrows flex cursor-pointer select-none items-center gap-1.5"
      data-role="sorting-arrows"
      data-name={name}
      data-order={JSON.stringify(props.sortingOrder)}
      // If object is passed as sorting order, then we need to get the first key
      data-order-key={
        isArray(props.sortingOrder)
          ? undefined
          : Object.keys(props.sortingOrder)[0]
      }
    >
      <div className="flex flex-col gap-[1.5px]">
        <ArrowUpIcon className="w-2.5 fill-gray-650 transition-colors group-data-[state=asc]/sorting-arrows:fill-black dark:fill-gray-650 dark:group-data-[state=asc]/sorting-arrows:fill-white" />
        <ArrowDownIcon className="w-2.5 fill-gray-650 transition-colors group-data-[state=desc]/sorting-arrows:fill-black dark:fill-gray-650 dark:group-data-[state=desc]/sorting-arrows:fill-white" />
      </div>
      {props.children}
    </div>
  )
}
