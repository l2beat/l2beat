'use client'
import { useState } from 'react'
import { useBreakpoint } from '~/hooks/use-is-mobile'
import ChevronIcon from '~/icons/chevron.svg'
import ExpandIcon from '~/icons/expand.svg'
import { cn } from '~/utils/cn'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './drawer'
import { Popover, PopoverContent, PopoverTrigger } from './popover'

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

export function Select({ title, options, value, onValueChange }: Props) {
  const [open, setOpen] = useState(false)
  const breakpoint = useBreakpoint()
  const showDrawer = breakpoint === 'tablet' || breakpoint === 'mobile'

  const selectedLabel = value
    ? options.find((option) => option.value === value)?.label
    : title

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
            <Options
              options={options}
              onClick={(option) => {
                onValueChange(option)
                setOpen(false)
              }}
            />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button className="group inline-flex items-center gap-1.5 whitespace-pre py-1 px-3 cursor-pointer select-none rounded-lg bg-gray-200 p-1 font-semibold text-base transition-colors dark:bg-zinc-700 dark:data-[state=selected]:hover:bg-slate-600 data-[state=selected]:hover:bg-gray-400">
          {selectedLabel ?? title}
          <ChevronIcon className="group-data-[state=open]:-rotate-180 ease-out duration-300 hidden transition-transform md:block fill-black dark:fill-white" />
          <ExpandIcon
            width={12}
            height={12}
            className="md:hidden my-auto fill-black dark:fill-white"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col" align="start">
        <Options
          options={options}
          className="px-2.5"
          onClick={(option) => {
            onValueChange(option)
            setOpen(false)
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

interface OptionsProps {
  options: Option[]
  onClick: (option: string | undefined) => void
  className?: string
}

function Options({ options, onClick, className }: OptionsProps) {
  return (
    <>
      {options.map((option) => (
        <button
          key={option.label}
          className={cn(
            'w-full outline-none text-left font-semibold text-base gap-1.5 rounded-lg py-2 transition-colors dark:hover:bg-zinc-800 hover:bg-gray-400',
            className,
          )}
          onClick={() => onClick(option.value)}
        >
          {option.label}
        </button>
      ))}
    </>
  )
}
