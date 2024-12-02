'use client'

import * as React from 'react'
import { ChevronIcon } from '~/icons/chevron'
import { cn } from '~/utils/cn'

interface Option<T extends string> {
  label: string
  value: T
}

interface Props<T extends string> {
  title?: string
  value: T
  onValueChange: (option: T) => void
  options: Option<T>[]
  disabled?: boolean
}

export function Select<T extends string>(props: Props<T>) {
  const id = React.useId()
  const selectedOption = props.options.find(
    (option) => option.value === props.value,
  )

  return (
    <label htmlFor={id} className="relative">
      <select
        id={id}
        className="peer absolute left-0 top-0 size-full opacity-0"
        value={props.value ?? ''}
        disabled={props.disabled ?? (!props.value && props.options.length < 2)}
        onChange={(e) => props.onValueChange(e.target.value as T)}
      >
        {props.title && (
          <option value="" disabled>
            Select {props.title}:
          </option>
        )}
        {props.options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div
        className={cn(
          'group flex min-h-8 select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 shadow-sm',
          'text-xs font-medium leading-none md:text-sm [&>span]:line-clamp-1',
          'bg-gray-200 sidebar:!bg-surface-primary sidebar:main-page-card:!bg-surface-secondary dark:bg-zinc-700',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-75',
          'ring-inset ring-brand peer-focus:outline-none peer-focus:ring-2',
          'z-20 transition-colors',
        )}
      >
        {selectedOption?.label ?? props.title}{' '}
        <ChevronIcon className="size-2.5 fill-current stroke-[1.8px] transition-transform md:size-3" />
      </div>
    </label>
  )
}
