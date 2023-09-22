import classNames from 'classnames'
import React from 'react'

import { ChevronDownIcon } from './icons'
import { CloseIcon } from './icons/CloseIcon'

interface Props {
  items: Item[]
  label: string
  className?: string
  id?: string
}

interface Item {
  label: string
  value: string
}

export function Select(props: Props) {
  return (
    <div
      className={classNames('Select group relative', props.className)}
      id={props.id}
    >
      <div className="Select-Toggle cursor-pointer select-none rounded-lg bg-gray-200 p-1 text-base font-semibold dark:bg-gray-750">
        <div className="inline-flex items-center gap-1.5 py-1.5 px-2 group-data-[state=selected]:hidden">
          {props.label}{' '}
          <ChevronDownIcon className="transition-transform group-data-[state=opened]:-rotate-180" />
        </div>
        <div className="group hidden items-center gap-1.5 rounded-md bg-black py-1.5 px-2 group-data-[state=selected]:inline-flex">
          <span className="Select-SelectedText" />
          <CloseIcon className="h-3 w-3 fill-gray-550 group-hover:fill-gray-650 dark:fill-gray-50 group-hover:dark:fill-gray-200" />
        </div>
      </div>
      <div className="pointer-events-none absolute z-60 opacity-0 transition-opacity group-data-[state=opened]:pointer-events-auto group-data-[state=opened]:opacity-100">
        <hr className="h-2 border-t-0" />
        <div className="cursor-pointer select-none rounded-lg bg-gray-200 px-3 py-2 text-base font-semibold dark:bg-gray-750">
          {props.items.map((item, index) => {
            return <SelectItem key={index} item={item} />
          })}
        </div>
      </div>
    </div>
  )
}

interface SelectItemProps {
  item: Item
}

function SelectItem({ item }: SelectItemProps) {
  return (
    <option
      className="rounded-lg py-2 px-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      value={item.value}
    >
      {item.label}
    </option>
  )
}
