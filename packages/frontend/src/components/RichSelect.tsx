import classNames from 'classnames'
import React from 'react'

import { ChevronDownIcon } from './icons'
import { CloseIcon } from './icons/CloseIcon'
import { ExpandIcon } from './icons/Expand'

interface Props {
  id: string
  label: string
  children: React.ReactNode
  slideCardTitle: string
  className?: string
  listClassName?: string
  centered?: boolean
}

export function RichSelect(props: Props) {
  return (
    <div
      className={classNames('RichSelect group', props.className)}
      id={props.id}
      data-centered={props.centered}
    >
      {/* TODO: Add hover to light mode */}
      <div className="RichSelect-Toggle cursor-pointer select-none rounded-lg bg-gray-200 p-1 text-base font-semibold transition-colors dark:bg-gray-750 dark:group-data-[state=selected]:group-hover:bg-slate-600">
        <div className="inline-flex items-center gap-1.5 px-2 group-data-[state=selected]:hidden">
          {props.label}
          <ChevronDownIcon className="hidden transition-transform group-data-[state=opened]:-rotate-180 md:block" />
          <ExpandIcon className="md:hidden" />
        </div>
        <div className="group hidden w-max items-center gap-1.5 rounded-md bg-white px-2 group-data-[state=selected]:inline-flex dark:bg-black dark:group-data-[state=selected]:group-hover:bg-gray-950">
          <span className="RichSelect-SelectedText" />
          <div className="flex h-3 w-3 items-center justify-center rounded-sm bg-black dark:bg-white">
            {/* TODO: add light hover */}
            <CloseIcon className="h-2.5 w-2.5 fill-white dark:fill-black dark:group-data-[state=selected]:group-hover:fill-gray-950" />
          </div>
        </div>
      </div>
      <div className="RichSelect-Dropdown pointer-events-none absolute z-60 mr-8 hidden opacity-0 transition-opacity group-data-[state=opened]:pointer-events-auto group-data-[state=opened]:opacity-100 md:block">
        <hr className="h-1.5 border-t-0" />
        <div
          className={classNames(
            'select-none rounded-lg bg-gray-200 px-3 py-2 text-base font-semibold dark:bg-gray-750',
            props.listClassName,
          )}
        >
          {props.children}
        </div>
      </div>
      {/* TODO: Add gradient to scroll */}
      <div className="RichSelect-SlideCard fixed left-0 bottom-0 z-999 flex h-[100dvh] w-full translate-y-full flex-col whitespace-normal bg-black/50 transition-transform duration-300 ease-out group-data-[state=opened]:translate-y-0 md:hidden">
        <div className="RichSelect-SlideCard-Close h-[10%]" />
        <div className="flex h-full flex-col gap-4 rounded-t-2xl bg-gray-200 p-4 dark:bg-gray-750">
          <div className="flex justify-between">
            <h2 className="text-3xl font-bold">{props.slideCardTitle}</h2>
            <CloseIcon className="RichSelect-SlideCard-Close h-4 w-4 fill-black dark:fill-white" />
          </div>
          <div className="relative flex grow flex-wrap">
            <div className="absolute inset-0 my-4 overflow-auto scroll-smooth">
              {props.children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

interface RichSelectItemProps {
  children: React.ReactNode
  selectedLabel: string
  value: string
  className?: string
}

RichSelect.Item = function ({
  children,
  value,
  selectedLabel,
  className,
}: RichSelectItemProps) {
  return (
    <div
      className={classNames(
        'RichSelect-Item flex cursor-pointer items-center gap-1.5 rounded-lg py-2 px-2.5 transition-colors hover:bg-gray-100 dark:hover:bg-zinc-800',
        className,
      )}
      data-value={value}
      data-selected-label={selectedLabel}
    >
      {children}
    </div>
  )
}
