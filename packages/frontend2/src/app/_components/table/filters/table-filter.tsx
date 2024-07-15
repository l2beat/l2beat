'use client'

import { assert } from '@l2beat/shared-pure'
import CloseIcon from '~/icons/close.svg'
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from '~/app/_components/drawer'
import { useState } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import ExpandIcon from '~/icons/expand.svg'
import { Select, SelectContent, SelectItem, SelectTrigger } from '../../select'

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
  const [open, setOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const showDrawer = breakpoint === 'tablet' || breakpoint === 'mobile'

  const selectedLabel = value
    ? options.find((option) => option.value === value)?.label
    : title

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

  if (showDrawer) {
    return (
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <button className="inline-flex w-max items-center gap-1.5 whitespace-pre py-1 px-3 cursor-pointer select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600 data-[state=selected]:hover:bg-gray-400">
            {selectedLabel ?? title}
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

  return (
    <Select open={open} onOpenChange={setOpen} onValueChange={onValueChange}>
      <SelectTrigger>{selectedLabel ?? title}</SelectTrigger>
      <SelectContent className="flex flex-col" align="start">
        {options.map((option) => (
          <SelectItem key={option.label} value={option.value ?? ''}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
