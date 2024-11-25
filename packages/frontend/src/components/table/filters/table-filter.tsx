'use client'
import { useId } from 'react'
import { ChevronIcon } from '~/icons/chevron'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'

interface Option<T extends string> {
  label: string
  value: T | undefined
}

interface Props<T extends string> {
  title: string
  options: Option<T>[]
  value: T | undefined
  onValueChange: (option: T | undefined) => void
}

export function TableFilter<T extends string>(props: Props<T>) {
  const id = useId()
  const selectedOption = props.options.find(
    (option) => option.value === props.value,
  )
  return (
    <label htmlFor={id} className="relative text-xs md:text-sm">
      <select
        id={id}
        className="peer absolute left-0 top-0 size-full opacity-0"
        value={props.value ?? ''}
        disabled={!props.value && props.options.length < 2}
        onChange={(e) =>
          props.onValueChange((e.target.value as T | '') || undefined)
        }
        onMouseDown={(e) => {
          if (props.value) {
            e.preventDefault()
            props.onValueChange(undefined)
          }
        }}
        onKeyDown={(e) => {
          if (props.value) {
            if (e.code === 'Space') {
              e.preventDefault()
              props.onValueChange(undefined)
            } else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
              e.preventDefault()
            }
          }
        }}
      >
        <option value="" disabled>
          Select {props.title}:
        </option>
        {props.options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <div
        className={cn(
          'group flex min-h-8 select-none items-center justify-between gap-1.5 whitespace-nowrap rounded-lg px-3 py-1 shadow-sm',
          'font-medium leading-none [&>span]:line-clamp-1',
          'bg-gray-200 sidebar:!bg-surface-primary sidebar:main-page-card:!bg-surface-secondary dark:bg-zinc-700',
          'peer-disabled:cursor-not-allowed peer-disabled:opacity-75',
          'ring-inset ring-brand peer-focus:outline-none peer-focus:ring-2',
          'z-20 transition-colors',
          props.value &&
            'text-brand peer-hover:!bg-surface-tertiary sidebar:main-page-card:peer-hover:!bg-surface-tertiary',
        )}
      >
        {selectedOption?.label ?? props.title}{' '}
        {props.value ? (
          <div className="inline-flex size-3 items-center justify-center rounded-sm bg-current">
            <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
          </div>
        ) : (
          <ChevronIcon className="size-2.5 fill-current stroke-[1.8px] transition-transform md:size-3" />
        )}
      </div>
    </label>
  )
}
