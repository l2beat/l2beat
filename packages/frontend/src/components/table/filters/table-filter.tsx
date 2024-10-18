'use client'
import { assert } from '@l2beat/shared-pure'
import { type Dispatch, type SetStateAction, useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/core/select'
import { CloseIcon } from '~/icons/close'

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

export function TableFilter<T extends string>(props: Props<T>) {
  const [open, setOpen] = useState(false)

  if (props.value) {
    return <SelectedValue {...props} />
  }

  return <TableFilterSelect {...props} open={open} setOpen={setOpen} />
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
      className="flex h-8 cursor-pointer select-none items-center justify-center gap-1.5 whitespace-pre rounded-lg px-2.5 text-sm font-medium text-brand outline-none transition-colors sidebar:bg-surface-primary sidebar:hover:bg-surface-tertiary"
    >
      <span>{option.label}</span>
      <div className="inline-flex size-3 items-center justify-center rounded-sm bg-current">
        <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
      </div>
    </button>
  )
}

function TableFilterSelect<T extends string>({
  open,
  setOpen,
  title,
  options,
  value,
  onValueChange,
}: Props<T> & {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  // Select component does not support undefined values
  // so we need to replace them with a special value
  // that will be handled by the onValueChange handler
  const mappedOptions = replaceUndefined(options)

  return (
    <Select
      value={value ?? ''}
      open={open}
      onOpenChange={setOpen}
      onValueChange={(v) => {
        const mappedValue = (v === UNDEFINED_VALUE ? undefined : v) as
          | T
          | undefined
        onValueChange(mappedValue)
      }}
      disabled={options.length === 0}
    >
      <SelectTrigger>
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
