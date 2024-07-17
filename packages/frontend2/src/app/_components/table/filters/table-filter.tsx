'use client'
import CloseIcon from '~/icons/close.svg'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from '~/app/_components/drawer'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import ExpandIcon from '~/icons/expand.svg'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../select'
import { assert } from '@l2beat/shared-pure'

const UNDEFINED_VALUE = 'undefined-value'

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

export function TableFilter(props: Props) {
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

function SelectedValue({ options, value, onValueChange }: Props) {
  const option = options.find((option) => option.value === value)
  assert(option, 'Option not found')
  return (
    <button
      onClick={() => onValueChange(undefined)}
      // TODO: Fix keyboard interactions
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

function TableFilterSelect({
  open,
  setOpen,
  title,
  options,
  value,
  onValueChange,
}: Props & {
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
}: Props & {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
}) {
  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <button className="inline-flex w-max items-center gap-1.5 whitespace-pre py-1 px-3 cursor-pointer select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600 data-[state=selected]:hover:bg-gray-400">
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
        <div className="max-h-[60vh] [@supports(height:100dvh)]:max-h-[60dvh] overflow-y-scroll">
          {options.map((option) => (
            <button
              key={option.label}
              className="w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 px-2.5 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400"
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
