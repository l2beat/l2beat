'use client'
import assert from 'assert'
import { KeyboardEvent, MouseEvent, useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/select'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'

const UNDEFINED_VALUE = 'undefined-value'

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

export function TableFilter<T extends string>({
  title,
  options,
  value,
  onValueChange,
}: Props<T>) {
  // Select component does not support undefined values
  // so we need to replace them with a special value
  // that will be handled by the onValueChange handler
  const mappedOptions = replaceUndefined(options)

  const onClick = useCallback((e: MouseEvent) => {
    if (value !== undefined) {
      e.preventDefault()
      onValueChange(undefined)
    }
  }, [])

  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (value !== undefined) {
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault()
        onValueChange(undefined)
      } else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
        e.preventDefault()
      }
    }
  }, [])
  return (
    <Select
      value={value ?? ''}
      onValueChange={(newValue) => {
        if (value !== undefined) {
          onValueChange(undefined)
          return
        }
        const mappedValue = (
          newValue === UNDEFINED_VALUE ? undefined : newValue
        ) as T | undefined
        onValueChange(mappedValue)
      }}
      disabled={
        options.length < 2 && !options.some((option) => option.value === value)
      }
    >
      <SelectTrigger
        className={cn(value !== undefined && 'text-brand')}
        icon={
          value !== undefined ? (
            <div className="inline-flex size-3 items-center justify-center rounded-sm bg-current">
              <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
            </div>
          ) : undefined
        }
        onClick={onClick}
        onPointerDown={onClick}
        onKeyDown={onKeyDown}
      >
        <SelectValue placeholder={title} />
      </SelectTrigger>
      <SelectContent className="flex flex-col" align="start">
        {mappedOptions.map((option) => (
          <SelectItem key={option.label} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

function SelectedValue<T extends string>({
  options,
  value,
  onValueChange,
}: Props<T>) {
  const option = options.find((option) => option.value === value)
  assert(option, 'Option not found')
  return (
    <button
      onClick={() => onValueChange(undefined)}
      className={cn(
        'flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-pre rounded-lg px-2.5 text-xs font-medium text-brand outline-none transition-colors md:text-sm',
        'sidebar:bg-surface-primary sidebar:hover:bg-surface-tertiary sidebar:main-page-card:bg-surface-secondary',
      )}
    >
      <span>{option.label}</span>
      <div className="inline-flex size-3 items-center justify-center rounded-sm bg-current">
        <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
      </div>
    </button>
  )
}

function replaceUndefined<T extends string>(
  options: Option<T>[],
): {
  label: string
  value: T
}[] {
  return options.map((option) => {
    if (option.value === undefined) {
      return { label: option.label, value: UNDEFINED_VALUE as T }
    }

    return {
      label: option.label,
      value: option.value,
    }
  })
}
