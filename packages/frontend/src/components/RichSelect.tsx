import classNames from 'classnames'
import React from 'react'

import { ChevronDownIcon } from './icons'
import { CloseIcon } from './icons/CloseIcon'

interface Props {
  label: string
  children: React.ReactNode
  className?: string
  listClassName?: string
  centered?: boolean
  id: string
}

export function RichSelect(props: Props) {
  return (
    <div
      className={classNames('RichSelect group relative', props.className)}
      id={props.id}
      data-centered={props.centered}
    >
      <div className="RichSelect-Toggle cursor-pointer select-none rounded-lg bg-gray-200 p-1 text-base font-semibold dark:bg-gray-750">
        <div className="inline-flex items-center gap-1.5 px-2 group-data-[state=selected]:hidden">
          {props.label}
          <ChevronDownIcon className="transition-transform group-data-[state=opened]:-rotate-180" />
        </div>
        <div className="group hidden w-max items-center gap-1.5 rounded-md bg-white px-2 group-data-[state=selected]:inline-flex dark:bg-black">
          <span className="RichSelect-SelectedText" />
          <CloseIcon className="h-3 w-3 fill-gray-550 dark:fill-gray-50" />
        </div>
      </div>
      <div className="RichSelect-Dropdown pointer-events-none invisible absolute z-60 hidden group-data-[state=opened]:pointer-events-auto group-data-[state=opened]:visible md:block">
        <hr className="h-2 border-t-0" />
        <div
          className={classNames(
            'w-max select-none rounded-lg bg-gray-200 px-3 py-2 text-base font-semibold dark:bg-gray-750',
            props.listClassName,
          )}
        >
          {props.children}
        </div>
      </div>
    </div>
  )
}

interface RichSelectItemProps {
  children: React.ReactNode
  selectedLabel: string
  value: string
}

RichSelect.Item = function ({
  children,
  value,
  selectedLabel,
}: RichSelectItemProps) {
  return (
    <div
      className="RichSelect-Item flex cursor-pointer items-center gap-1.5 rounded-lg py-2 px-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      data-value={value}
      data-selected-label={selectedLabel}
    >
      {children}
    </div>
  )
}
