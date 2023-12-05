import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '../icons'

interface Props {
  name: string
  sortingOrder: string[]
}

export function SortingArrows(props: Props) {
  return (
    <div
      className="group flex cursor-pointer select-none flex-col gap-[1.5px]"
      data-role="sorting-arrows"
      data-name={props.name.split(' ').join('-').toLowerCase()}
      data-order={props.sortingOrder}
    >
      <ArrowUpIcon className="w-2.5 fill-gray-650 transition-colors group-data-[state=asc]:fill-black dark:fill-gray-650 dark:group-data-[state=asc]:fill-white" />
      <ArrowDownIcon className="w-2.5 fill-gray-650 transition-colors group-data-[state=desc]:fill-black dark:fill-gray-650 dark:group-data-[state=desc]:fill-white" />
    </div>
  )
}
