'use client'
import { assert } from '@l2beat/shared-pure'
import { type Dispatch, type SetStateAction, useState } from 'react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '~/app/_components/drawer'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import CloseIcon from '~/icons/close.svg'
import ExpandIcon from '~/icons/expand.svg'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select'

const UNDEFINED_VALUE = 'undefined-value'

interface Option {
  label: string
  value: string | undefined
}

interface Props<T> {
  title: string
  options: Option[]
  value: T | undefined
  onValueChange: (option: T | undefined) => void
}

export function TableFilter<T extends string | undefined>(props: Props<T>) {
  const [open, setOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const showDrawer = breakpoint === 'tablet' || breakpoint === 'mobile'

  if (props.value) {
    return <SelectedValue {...props} />
  }

  if (showDrawer) {
    return <TableFilterDrawer {...props} open={open} setOpen={setOpen} />
  }

  return <TableFilterSelect {...props} open={open} setOpen={setOpen} />
}

function SelectedValue({ options, value, onValueChange }: Props<any>) {
  const option = options.find((option) => option.value === value)
  assert(option, 'Option not found')
  return (
    <button
      onClick={() => onValueChange(undefined)}
      className="cursor-pointer select-none rounded-lg bg-gray-200 p-1 text-base font-semibold outline-none transition-colors hover:bg-gray-400 dark:bg-zinc-700 dark:hover:bg-slate-600"
    >
      <div className="inline-flex w-max items-center gap-1.5 rounded-md bg-white px-2 dark:bg-black dark:group-hover:bg-gray-950">
        <span>{option.label}</span>
        <div className="flex size-3 items-center justify-center rounded-sm bg-black dark:bg-white">
          <CloseIcon className="size-2.5 fill-white dark:fill-black dark:group-hover:fill-gray-950" />
        </div>
      </div>
    </button>
  )
}

function TableFilterSelect({
  open,
  setOpen,
  title,
  options,
  value,
  onValueChange,
}: Props<any> & {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  // Select component does not support undefined values
  // so we need to replace them with a special value
  // that will be handled by the onValueChange handler
  const mappedOptions = replaceUndefined(options)

  return (
    <Select
      open={open}
      value={value ?? ''}
      onOpenChange={setOpen}
      onValueChange={(v) => {
        const mappedValue = v === UNDEFINED_VALUE ? undefined : v
        onValueChange(mappedValue)
      }}
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

function TableFilterDrawer({
  open,
  setOpen,
  title,
  options,
  onValueChange,
}: Props<any> & {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="inline-flex w-max cursor-pointer select-none items-center gap-1.5 whitespace-pre rounded-lg bg-gray-200 p-1 px-3 text-base font-semibold transition-colors data-[state=selected]:hover:bg-gray-400 dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600">
          {title}
          <ExpandIcon
            width={12}
            height={12}
            className="my-auto fill-black dark:fill-white"
          />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
        </DrawerHeader>
        <div className="max-h-[60vh] overflow-y-scroll [@supports(height:100dvh)]:max-h-[60dvh]">
          {options.map((option) => (
            <button
              key={option.label}
              className="w-full gap-1.5 rounded-lg px-2.5 py-2 text-left text-base font-semibold outline-none transition-colors hover:bg-gray-400 dark:hover:bg-zinc-800"
              onClick={() => {
                onValueChange(option.value)
                setOpen(false)
              }}
            >
              {option.label}
            </button>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function replaceUndefined(options: Option[]): {
  label: string
  value: string
}[] {
  return options.map((option) => {
    if (option.value === undefined) {
      return { label: option.label, value: UNDEFINED_VALUE }
    }

    return {
      label: option.label,
      value: option.value,
    }
  })
}
