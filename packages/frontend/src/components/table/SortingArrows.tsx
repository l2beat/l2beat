import classNames from 'classnames'
import React from 'react'

import { ArrowDownIcon, ArrowUpIcon } from '../icons'
import { SortingRule, SortingState } from './types'

interface Props {
  children?: React.ReactNode
  name: string
  rule: SortingRule
  orderKey: string | undefined
  defaultState?: SortingState
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
      data-rule={props.rule}
      data-state={props.defaultState}
      data-order-key={props.orderKey}
    >
      <div className="flex flex-col gap-[1.5px]">
        <ArrowUpIcon
          className={classNames(
            'w-2.5 fill-gray-650 transition-all dark:fill-gray-650',
            'group-data-[state=asc]/sorting-arrows:fill-black dark:group-data-[state=asc]/sorting-arrows:fill-white',
            'dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:fill-white dark:group-data-[state=desc]/sorting-arrows:group-hover/sorting-arrows:opacity-60',
          )}
        />
        <ArrowDownIcon
          className={classNames(
            'w-2.5 fill-gray-650 transition-all dark:fill-gray-650',
            'group-data-[state=desc]/sorting-arrows:fill-black dark:group-data-[state=desc]/sorting-arrows:fill-white',
            'group-data-[state=asc]/sorting-arrows:group-hover/sorting-arrows:opacity-60 dark:group-hover/sorting-arrows:fill-white',
          )}
        />
      </div>
      {props.children}
    </div>
  )
}
