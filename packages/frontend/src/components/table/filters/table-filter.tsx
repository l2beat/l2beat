'use client'
import type { KeyboardEvent, MouseEvent } from 'react'
import { useCallback } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/select'
import { useTracking } from '~/hooks/use-custom-event'
import { CloseIcon } from '~/icons/close'
import { cn } from '~/utils/cn'

interface Props {
  title: string
  options: string[]
  value: string | undefined
  onValueChange: (option: string | undefined) => void
}

export function TableFilter({ title, options, value, onValueChange }: Props) {
  const { track } = useTracking()
  const onClick = useCallback(
    (e: MouseEvent) => {
      if (value !== undefined) {
        e.preventDefault()
        onValueChange(undefined)
      }
    },
    [value, onValueChange],
  )

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (value !== undefined) {
        if (e.code === 'Space' || e.code === 'Enter') {
          e.preventDefault()
          onValueChange(undefined)
        } else if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
          e.preventDefault()
        }
      }
    },
    [value, onValueChange],
  )

  return (
    <Select
      value={value ?? ''}
      onValueChange={(newValue) => {
        if (value !== undefined) {
          onValueChange(undefined)
          return
        }
        track('filterChanged', {
          props: {
            name: title,
            value: newValue,
          },
        })
        onValueChange(newValue)
      }}
      disabled={options.length < 2 && !value}
    >
      <SelectTrigger
        className={cn(
          'primary-card:bg-surface-secondary primary-card:data-[state=open]:hover:bg-surface-tertiary',
          value !== undefined && 'text-brand',
        )}
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
      <SelectContent
        className={cn('flex flex-col primary-card:bg-surface-secondary')}
        align="start"
      >
        {options.map((option) => (
          <SelectItem
            key={option}
            value={option}
            className="primary-card:focus:bg-surface-tertiary"
          >
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
