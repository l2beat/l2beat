'use client'

import { assert } from '@l2beat/shared-pure'
import CloseIcon from '~/icons/close.svg'
import { Select } from '~/app/_components/select'

interface Option {
  label: string
  value: string | undefined
}

interface Props {
  title: string
  options: Option[]
  value: string | undefined
  onValueChange: (option: string | undefined) => void
}

export function TableFilter({ title, options, value, onValueChange }: Props) {
  if (value) {
    const option = options.find((option) => option.value === value)
    assert(option, 'Option not found')
    return (
      <button
        autoFocus
        onClick={() => onValueChange(undefined)}
        onKeyDown={(e) => {
          if (e.key === 'Escape') {
            onValueChange(undefined)
          }
        }}
        className="cursor-pointer outline-none select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:hover:bg-slate-600 hover:bg-gray-400"
      >
        <div className="w-max items-center gap-1.5 rounded-md bg-white px-2 inline-flex dark:bg-black dark:group-hover:bg-gray-950">
          <span>{option.label}</span>
          <div className="flex size-3 items-center justify-center rounded-sm bg-black dark:bg-white">
            <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
          </div>
        </div>
      </button>
    )
  }

  return (
    <Select
      title={title}
      options={options}
      value={value}
      onValueChange={onValueChange}
    />
  )
}
