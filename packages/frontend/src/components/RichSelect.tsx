import classNames from 'classnames'
import React from 'react'

import { ChevronDownIcon } from './icons'
import { CloseIcon } from './icons/CloseIcon'
import { ExpandIcon } from './icons/Expand'

interface Props {
  id: string
  label: string
  children: React.ReactNode
  slideCardTitle?: string
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
      <div className="RichSelect-Toggle cursor-pointer select-none rounded-lg bg-gray-200 p-1 text-base font-semibold transition-colors group-data-[state=selected]:group-hover:bg-gray-400 dark:bg-gray-750 dark:group-data-[state=selected]:group-hover:bg-slate-600">
        <div className="inline-flex items-center gap-1.5 whitespace-pre px-2 group-data-[state=selected]:hidden">
          {props.label}
          <ChevronDownIcon className="hidden transition-transform group-data-[state=opened]:-rotate-180 md:block" />
          <ExpandIcon className="md:hidden" />
        </div>
        <div className="group hidden w-max items-center gap-1.5 rounded-md bg-white px-2 group-data-[state=selected]:inline-flex dark:bg-black dark:group-data-[state=selected]:group-hover:bg-gray-950">
          <span className="RichSelect-SelectedText" />
          <div className="flex h-3 w-3 items-center justify-center rounded-sm bg-black dark:bg-white">
            <CloseIcon className="h-2.5 w-2.5 fill-white dark:fill-black dark:group-data-[state=selected]:group-hover:fill-gray-950" />
          </div>
        </div>
      </div>
      <div className="RichSelect-Dropdown pointer-events-none absolute z-60 mr-8 hidden opacity-0 transition-opacity group-data-[state=opened]:pointer-events-auto group-data-[state=opened]:opacity-100 md:block">
        <hr className="h-1.5 border-t-0" />
        <div
          className={classNames(
            'select-none rounded-lg bg-gray-200 p-2 text-base font-semibold dark:bg-gray-750',
            props.listClassName,
          )}
        >
          {props.children}
        </div>
      </div>
      <div className="RichSelect-SlideCard">
        <div className="RichSelect-SlideCard-Background pointer-events-none fixed inset-x-0 bottom-0 z-999 h-full w-full bg-black/50 opacity-0 transition-opacity group-data-[state=opened]:pointer-events-auto group-data-[state=opened]:opacity-100 md:hidden" />
        <div className="RichSelect-SlideCard-Content fixed inset-x-0 bottom-0 z-999 translate-y-full whitespace-normal rounded-t-2xl bg-gray-100 p-4 transition-transform duration-300 ease-out group-data-[state=opened]:translate-y-0 dark:bg-gray-750 md:hidden">
          <div className="relative flex justify-between">
            <div className="RichSelect-SlideCard-GestureZone absolute bottom-0 -top-4 -left-4 -right-4" />
            <h2 className="text-3xl font-bold leading-normal">
              {props.slideCardTitle ?? props.label}
            </h2>
            <CloseIcon className="RichSelect-SlideCard-CloseButton z-[1000] h-5 w-5 fill-black dark:fill-white" />
          </div>
          <div className="relative">
            <div className="absolute inset-x-0 -top-1 z-20 h-6 bg-gradient-to-b from-gray-100 via-gray-100 to-transparent dark:from-gray-750 dark:via-gray-750" />
            <div className="max-h-[80svh] overflow-auto">
              <div className="h-6" />
              {props.children}
              <div className="h-6" />
            </div>
            <div className="absolute inset-x-0 -bottom-1 z-20 h-6 bg-gradient-to-t from-gray-100 via-gray-100 to-transparent dark:from-gray-750 dark:via-gray-750" />
          </div>
        </div>
      </div>
    </div>
  )
}

interface RichSelectItemProps {
  children: React.ReactNode
  value: string | string[]
  selectedLabel: string
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
        'RichSelect-Item flex cursor-pointer items-center gap-1.5 rounded-lg py-2 px-2.5 transition-colors hover:bg-gray-400 dark:hover:bg-zinc-800',
        className,
      )}
      data-value={value}
      data-selected-label={selectedLabel}
    >
      {children}
    </div>
  )
}
